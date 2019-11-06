

const mongoose = require('mongoose');
const questionSchema = require('./question');
const quizService = require('../service/quiz-schema-service');
const websocketService = require('../service/websocket-services');

mongoose.set('debug', true);

const quizSchema = new mongoose.Schema({
    code: {type: String, maxLength: 6},
    name: {type: String, required: true},
    quizOwner: {type: mongoose.Types.ObjectId, ref: 'Account', required: true},
    teams: [{teamName: {type: String}, points: {type: Number, required: true, default: 0}}],
    isOpen: {type: Boolean, required: true, default: true},
    isActive: {type: Boolean, required: true, default: true},
    roundNumber: {type: Number, required: true, default: 0},
    questionNumber: {type: Number, required: true, default: 0},
    questions: [
        {
            _id: {type: mongoose.Types.ObjectId, ref: 'Question', /*unique: true*/},
            // roundNumber: Number,
            isActive: {type: Boolean, required: true, default: false},
            isClosed: {type: Boolean, required: true, default: false},
            isValidated: {type: Boolean, required: true, default: false},
            timer: {type: Boolean},
            timestamp: {type: Number}
        }
    ],
    answeredQuestions: [
        {
            _id: {type: mongoose.Types.ObjectId, ref: 'Question'},
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

quizSchema.statics.createNewQuiz = async function (quizName, accountId) {

    let codes = await this.distinct('code');
    let randomCode = quizService.getRandomCodeForQuiz();
    while (codes.some(el => el === randomCode)) {
        randomCode = quizService.getRandomCodeForQuiz();
    }
    let quiz = new Quiz({code: randomCode, name: quizName, quizOwner: new mongoose.Types.ObjectId(accountId)});
    await quiz.save();
    return quiz;
};

quizSchema.methods.getQuestionsForRound = async function () {
    try {

        let refQuizQuestions = this.questions.slice(((this.roundNumber - 1) * 12), this.questions.length);
        let questions = await Question.getQuestionsById(refQuizQuestions.map(el => el._id));

        return refQuizQuestions.reduce((acc, refQuestion) => {
            Object.assign(acc.find(question => String(question._id) === String(refQuestion._id))._doc, refQuestion._doc);
            return acc;
        }, questions);

    } catch (err) {
        console.log(err);
    }
};

quizSchema.methods.getActiveQuestion = async function () {
    try {
        let activeQuestion = this.questions.find(question => question.isActive === true);
        if (activeQuestion) {
            let question = await Question.findById(activeQuestion._id);
            return {
                ...question._doc,
                isClosed: activeQuestion.isClosed,
                isValidated: activeQuestion.isValidated,
                timer: activeQuestion.timer,
                timestamp: activeQuestion.timestamp
            }
        }
        return {};
    } catch (err) {
        console.log(err);
    }
};

quizSchema.methods.setRoundQuestionsByCategories = async function (categories) {
    let currentQuestions = this.questions.map(question => question._id);
    let questions = await Question.getQuestionsForRound(categories, currentQuestions);
    this.questions = [...this.questions, ...questions];
    const activeQuestion = this.questions.find(question => question.isActive === true);
    if(activeQuestion) {
        activeQuestion.isActive = false
    }
    this.roundNumber++;
    this.questionNumber = 0;
    await this.save();
};

quizSchema.methods.addJoinedTeamToQuiz = async function (team) {
    try {
        team.points = 0;
        if (!this.teams.some(e => e.teamName === team.teamName)) {
            this.teams.push(team);
            this.save();
            return team;
        } else {
            return null;
        }
    } catch (err) {
        console.log(err);
    }
};

quizSchema.methods.getJoinedTeamsOfQuiz = async function () {
    try {
        return this.teams;
    } catch (err) {
        console.log(err);
    }
};

quizSchema.methods.setDefinitiveTeamsForQuiz = async function (teams) {
    try {
        this.teams = quizService.formatTeamArrayForMongooseModel(teams);
        this.isOpen = false;
        this.save();
    } catch (err) {
        console.log(err);
    }
};

quizSchema.methods.setActiveQuestion = async function (req) {

    const {id, timer, seconds} = req.body;

    // get the current active question if it exists. Set it to false.
    const currentActiveQuestion = this.questions.find(question => question.isActive === true)
    if (currentActiveQuestion !== undefined) {
        currentActiveQuestion.isActive = false;
    }
    // get the next current question
    const newActiveQuestion = this.questions.find(question => question._id.toString() === id);
    newActiveQuestion.isActive = true;

    if(timer && seconds > 0) {
        const milliseconds          = seconds * 1000;
        newActiveQuestion.timer     = true;
        newActiveQuestion.timestamp = Math.round((new Date()).getTime()) + milliseconds;
        setTimeout(() => this.closeActiveQuestion(req), milliseconds);
    }

    this.questionNumber++;
    await this.save();

    websocketService.sendMessageToWebsocketTeams(req, "UPDATE_ACTIVE_QUESTION");
    websocketService.sendMessageToWebsocketScoreboard(req, "UPDATE_ACTIVE_QUESTION");

};

quizSchema.methods.closeActiveQuestion = async function (req) {

    const quiz                  = await Quiz.findOne({code: req.quiz.code});
    const currentActiveQuestion = quiz.questions.find(question => question.isActive === true);

    if(currentActiveQuestion.isClosed !== true) {
        currentActiveQuestion.isClosed  = true;
        await quiz.save();

        websocketService.sendMessageToWebsocketTeams(req, "UPDATE_CLOSED_QUESTION");
        websocketService.sendMessageToWebsocketScoreboard(req, "UPDATE_CLOSED_ACTION");
        websocketService.sendMessageToWebsocketQuizmaster(req, "UPDATE_CLOSED_ACTION")
    }
};

quizSchema.methods.setTeamAnswerForQuestion = async function (teamName, answer) {
    try {
        // check if the team that has given the answer belongs to this quiz
        if (this.teams.some((team) => team.teamName === teamName)) {
            let currentlyAnsweredQuestion;
            // get the current active question
            let currentQuestion = this.questions.find(question => question.isActive === true);

            // TODO: Check if there is a question, otherwise results in exception
            // check if the current question isn't marked as closed
            if (!currentQuestion.isClosed === true) {
                let currentQuestionId = currentQuestion._id;

                // get the questions index from the answered questions array
                currentlyAnsweredQuestion = quizService.getCurrentAnsweredQuestionIndexByQuestionId(this, currentQuestionId);

                // if the questions has not yet been added to the array and its index is thus <1
                if (currentlyAnsweredQuestion < 0) {
                    //add it
                    this.answeredQuestions.push(currentQuestionId);
                }

                // get the questions index from the answeredquestions array AGAIN because it just has been added
                currentlyAnsweredQuestion = quizService.getCurrentAnsweredQuestionIndexByQuestionId(this, currentQuestionId);

                // get the answer index for the question based on teamname
                let givenAnswerIndex = quizService.getCurrentAnsweredQuestionAnswerByTeamName(this, currentlyAnsweredQuestion, teamName);

                // save or update the team answer based on whether this is their first answer or not
                quizService.saveOrUpdateTeamAnswer(this, givenAnswerIndex, currentlyAnsweredQuestion, teamName, answer);

                await this.save();
            }
        }
    } catch (err) {
        console.log(err);
    }
};

quizSchema.methods.getGivenAnswers = async function () {
    try {
        // get the current questionID by checking which question is currently active
        let currentQuestionIndex = quizService.getActiveQuestionIndex(this);
        let currentQuestionId = this.questions[currentQuestionIndex]._id;

        // get the answers for this question by matching the id's on string value and return the current answers
        let currentlyAnsweredQuestion = quizService.getCurrentAnsweredQuestionIndexByQuestionId(this, currentQuestionId);
        console.log(currentlyAnsweredQuestion);
        if(currentlyAnsweredQuestion >= 0) {
            return this.answeredQuestions[currentlyAnsweredQuestion];
        } else {
            return {answers: []};
        }

    } catch (err) {
        console.log(err);
    }
};

quizSchema.methods.judgeGivenAnswers = async function (givenAnswers) {
    try {
        let currentQuestion = this.questions.find(question => question.isActive === true);
        let currentQuestionId = currentQuestion._id;
        let currentlyAnsweredQuestion = quizService.getCurrentAnsweredQuestionIndexByQuestionId(this, currentQuestionId);
        givenAnswers.forEach((item) => {
            let teamAnswerIndex = quizService.getCurrentAnsweredQuestionAnswerByTeamName(this, currentlyAnsweredQuestion, item.teamName);
            this.answeredQuestions[currentlyAnsweredQuestion].answers[teamAnswerIndex].isRight = item.isRight;
        });
        currentQuestion.isValidated = true;
        await this.save();
    } catch (err) {
        console.log(err);
    }
};

quizSchema.methods.updateTeamPoints = async  function () {

    const roundNumber           = (this.isActive ? this.roundNumber - 1 : this.roundNumber);
    const roundQuestions        = quizService.getValidatedAndClosedRoundQuestions(this.questions, roundNumber);

    if(roundQuestions.length > 0) {

        const roundResult           = quizService.getRoundResult(roundQuestions, this.answeredQuestions, this.teams);
        const roundTeamPositions    = quizService.getTeamRoundPositions(roundResult);
        const lastPosition          = Object.keys(roundTeamPositions).length;

        for(let position = 0; position < lastPosition; position++) {
            roundTeamPositions[position].forEach(positionTeam => {
                this.teams.find(team => team.teamName === positionTeam.teamName).points += quizService.getPositionPoints(position)
            })
        }

        await this.save();
    }
};

quizSchema.methods.getScore = function () {

    const roundQuestions = quizService.getValidatedAndClosedRoundQuestions(this.questions, this.roundNumber);
    const validateQuestions = roundQuestions.filter(question => question.isValidated);

    let response = {
        isActive: this.isActive,
        roundNumber: this.roundNumber,
        questionNumber: this.questionNumber,
    };

    if (validateQuestions.length === 0) {
        return {
            ...response,
            score: quizService.sortScoreArray(this.teams, 'points').map(team => {
                return {
                    ...team._doc,
                    correct: 0
                }
            })
        }
    } else {
        const roundResult = quizService.getRoundResult(roundQuestions, this.answeredQuestions, this.teams);
        return {
            ...response,
            score: quizService.sortScoreArray(this.teams, 'points').map(team => {
                const teamRoundResult = roundResult.find(result => result.teamName === team.teamName);
                return {
                    ...team._doc,
                    correct: (teamRoundResult ? teamRoundResult.correct : 0)
                }
            })
        }
    }
};

const Quiz = mongoose.model("Quiz", quizSchema);
const Question = mongoose.model('Question', questionSchema);