const mongoose          = require('mongoose');
const questionSchema    = require('./question');

mongoose.set('debug', true);

const quizSchema = new mongoose.Schema({
    code: {type: String, maxLength: 6},
    name: {type: String, required: true},
    //quizOwner: {_id: {type: mongoose.Types.ObjectId, ref: 'Account'}}
    teams: [{teamName: {type: String}, points: {type: Number, required: true, default: 0}}],
    isActive: {type: Boolean, required: true, default: false},
    roundNumber: {type: Number, required: true, default: 0},
    questionNumber: {type: Number, required: true, default: 1},
    questions: [
        {
            _id: {type: mongoose.Types.ObjectId, ref: 'Question', /*unique: true*/},
            // roundNumber: Number,
            isActive: {type: Boolean, required: true, default: false},
            isClosed: {type: Boolean, required: true, default: false},
        }
    ],
    answeredQuestions: [
        {
            _id: {type:  mongoose.Types.ObjectId, ref: 'Question'},
            answers: [
                {
                    teamName: String,
                    givenAnswer: {type: String, required: true},
                    isRight: {type: Boolean, default: null},
                }
            ]
        }
    ]
});

quizSchema.statics.createNewQuiz = async function(quizName) {
    try {
        let codes = await this.distinct('code');
        let randomCode = getRandomCodeForQuiz();
        while(codes.some(el => el === randomCode)){
           randomCode = getRandomCodeForQuiz();
           console.log("er is een dubbele");
        }
        let quiz = new Quiz({code: randomCode, name: quizName});
        await quiz.save();
        return quiz;
    } catch (err) {

    }
};

quizSchema.methods.getQuestionsForRound = async function () {
    try {
        console.log('hiero');
        console.log(this.questions);
        let refQuestionIds = this.questions.slice(((this.roundNumber -1) * 12), this.questions.length).filter(q => !q.isActive).map(el => el._id);

        //console.log(refQuestionIds.length);
        let questions = await Question.getQuestionsById(refQuestionIds);

        return mapQuestionsToOrganizedByCategory(questions);
    } catch (err) {
        console.log(err);
    }
};

quizSchema.methods.getActiveQuestion = async function() {
    try {
        let activeQuestion = this.questions.find(question => question.isActive === true);
        if(activeQuestion) {
            let question = await Question.findById(activeQuestion._id);
            return {
                ...question._doc,
                isClosed: activeQuestion.isClosed
            }
        }
        return {};
    } catch (err) {
        console.log(err);
    }
};

quizSchema.methods.setRoundQuestionsByCategories = async function(categories) {
    try {
        let currentQuestions = this.questions.map(question => question._id);
        let questions = await Question.getQuestionsForRound(categories, currentQuestions);
        this.questions = [...this.questions, ...questions];
        this.roundNumber++;
        this.save();
    } catch (err) {
        console.log(err)
    }
};

quizSchema.methods.addJoinedTeamToQuiz = async function(team){
    try {
        team.points = 0;
        if(!this.teams.some(e => e.teamName === team.teamName)){
            this.teams.push(team);
            this.save();
            return team;
        } else {
            throw new Error("A team name must be unique");
        }
    } catch (err) {
        throw err;
    }
};

quizSchema.methods.getJoinedTeamsOfQuiz = async function(){
    try {
        return this.teams;
    } catch (err) {
        console.log(err);
    }
};

quizSchema.methods.setDefinitiveTeamsForQuiz = async function(teams){
    try {
        this.teams = formatTeamArrayForMongooseModel(teams);
        this.save();
    } catch (err) {
        console.log(err);
    }
};

quizSchema.methods.setActiveQuestion = async function(questionId) {
    try {
        // get the current active question if it exists. Set it to false.
        let currentActiveQuestionIndex = getActiveQuestionIndex(this);
        if(currentActiveQuestionIndex >= 0){
            this.questions[currentActiveQuestionIndex].isActive = false;
        }

        // get the next current question
        let currentQuestionIndex = this.questions.findIndex(e => e._id.toString() === questionId);
        this.questions[currentQuestionIndex].isActive = true;
        await this.save();
    } catch (err) {
        console.log(err)
    }
};

quizSchema.methods.setClosedQuestion = async function(questionId) {
    try {
        let currentQuestionIndex = getActiveQuestionIndex(this);
        this.questions[currentQuestionIndex].isClosed = true;
        await this.save();
    } catch (err) {
        console.log(err);
    }
};

quizSchema.methods.setTeamAnswerForQuestion = async function(teamName, answer) {
    try {
        // check if the team that has given the answer belongs to this quiz
        if(this.teams.some((team) => team.teamName === teamName)){
            let currentlyAnsweredQuestion;
            // get the current active question
            let currentQuestion = this.questions.find(question => question.isActive === true);

            // check if the current question isn't marked as closed
            if(!currentQuestion.isClosed === true) {
                let currentQuestionId = currentQuestion._id;

                // get the questions index from the answeredquestions array
                currentlyAnsweredQuestion = getCurrentAnsweredQuestionIndexByQuestionId(this, currentQuestionId);

                // if the questions has not yet been added to the array and its index is thus <1
                if (currentlyAnsweredQuestion < 0) {
                    //add it
                    this.answeredQuestions.push(currentQuestionId);
                }

                // get the questions index from the answeredquestions array AGAIN because it just has been added
                currentlyAnsweredQuestion = getCurrentAnsweredQuestionIndexByQuestionId(this, currentQuestionId);

                // get the answer index for the question based on teamname
                let givenAnswerIndex = getCurrentAnsweredQuestionAnswerByTeamName(this, currentlyAnsweredQuestion, teamName);

                // save or update the team answer based on whether this is their first answer or not
                saveOrUpdateTeamAnswer(this, givenAnswerIndex, currentlyAnsweredQuestion, teamName, answer);

                await this.save();
            }
        }
    } catch (err) {
        console.log(err);
    }
};

quizSchema.methods.getGivenAnswers = async function() {
    try {
        // get the current questionID by checking which question is currently active
        let currentQuestionIndex = getActiveQuestionIndex(this);
        let currentQuestionId = this.questions[currentQuestionIndex]._id;

        // get the answers for this question by matching the id's on string value and return the current answers
        let currentlyAnsweredQuestion = getCurrentAnsweredQuestionIndexByQuestionId(this, currentQuestionId);
        return this.answeredQuestions[currentlyAnsweredQuestion];
    } catch (err) {
        console.log(err);
    }
};

quizSchema.methods.judgeGivenAnswers = async function(givenAnswers) {
    try {
        let currentQuestionId = this.questions.find(question => question.isActive === true)._id;
        let currentlyAnsweredQuestion = getCurrentAnsweredQuestionIndexByQuestionId(this, currentQuestionId);
        givenAnswers.forEach((item) => {
            let teamAnswerIndex = getCurrentAnsweredQuestionAnswerByTeamName(this, currentlyAnsweredQuestion, item.teamName);
            this.answeredQuestions[currentlyAnsweredQuestion].answers[teamAnswerIndex].isRight = item.correct;
        });
        await this.save();
    } catch (err) {
        console.log(err);
    }
};

// helper function to format the questions to a more frontend friendly format.
mapQuestionsToOrganizedByCategory = (questions) => {
    let result = [];
    let distinctCategories = [...new Set(questions.map(el => el.category))];
    let category = {};
    category.questions = [];

    distinctCategories.forEach((cat, index) => {
        result.push({category: cat, questions: []});
    });

    questions.forEach((q, index) => {
        result.forEach((cat, index) => {
            if(q.category === cat.category){
                cat.questions.push(q);
            }
        })
    });
    return result;
};

// generate a random code to be the unique identifier of a quiz
getRandomCodeForQuiz = () => {
    return Math.random().toString(36).substr(2, 6);
};

// get the INDEX of the CURRENT active question
getActiveQuestionIndex = (schema) => {
    return schema.questions.findIndex(e => e.isActive === true);
};

// get the INDEX of the CURRENT active question with answers (which is not the same array as the questions array)
getCurrentAnsweredQuestionIndexByQuestionId = (schema, currentQuestionId) => {
    return schema.answeredQuestions.findIndex(e => e._id.toString() === currentQuestionId.toString());
};

// get the INDEX of the ANSWER a team has given to the CURRENT active question (the array where the answers are kept as well)
getCurrentAnsweredQuestionAnswerByTeamName = (schema, currentlyAnsweredQuestion, teamName) => {
    return schema.answeredQuestions[currentlyAnsweredQuestion].answers.findIndex(e => e.teamName === teamName);
};

// Helper method to check whether a team has already given an answer to a certain question
// if not: push it to the array with its values
// if so: update the answer value accordingly
saveOrUpdateTeamAnswer = (schema, givenAnswerIndex, answeredQuestionIndex, team, answer) => {
    if (givenAnswerIndex < 0) {
        schema.answeredQuestions[answeredQuestionIndex].answers.push({
            isRight: null,
            teamName: team,
            givenAnswer: answer
        });
    } else {
        schema.answeredQuestions[answeredQuestionIndex].answers[givenAnswerIndex].givenAnswer = answer;
    }
};

function formatTeamArrayForMongooseModel(teams) {
    return teams.map((el) => {
        return {
            teamName: el,
            points: 0
        }
    });
}


const Quiz = mongoose.model("Quiz", quizSchema);
const Question = mongoose.model('Question', questionSchema);