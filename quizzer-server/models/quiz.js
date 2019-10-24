const mongoose          = require('mongoose');
//mongoose.set('debug', true)
const uniqueValidator   = require('mongoose-unique-validator');
const questionSchema    = require('./question');
let ObjectId            = require('mongoose').Types.ObjectId;

const quizSchema = new mongoose.Schema({
    code: {type: String, unique: true, maxLength: 6},
    naam: {type: String, required: true},
    teams: [{teamName: {type: String, /*unique: true,*/ points: Number}}],
    isActive: {type: Boolean, required: true, default: false},
    roundNumber: {type: Number, required: true, default: 1},
    questionNumber: {type: Number, required: true, default: 1},
    questions: [
        {
            _id: {type: mongoose.Types.ObjectId, ref: 'Question', unique: true},
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
                    isRight: {type: Boolean},
                }
            ]
        }
    ]
});

quizSchema.methods.getActiveQuestion = async function() {
    try {
        let activeQuestion = this.questions.find(question => question.isActive === true);
        let fullQuestion = await Question.findById(activeQuestion._id);
        return fullQuestion;
    } catch (err) {
        console.log(err);
    }
};

quizSchema.methods.setRoundQuestionsByCategories = async function(categories) {
    try {
        let currentQuestions = this.questions.map(question => question._id);
        let questions = await Question.getQuestionsForRound(categories, currentQuestions);
        this.questions = [...this.questions, ...questions];
        this.save();
    } catch (err) {
        console.log(err)
    }
};

quizSchema.methods.addJoinedTeamToQuiz = async function(team){
    try {
        if(!this.teams.some(e => e.teamName === team.teamName)){
            this.teams.push(team);
            this.save();
        } else {
            throw new Error("A team name must be unique");
        }
    } catch (err) {
        console.log(err);
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
        this.teams = teams;
        this.save();
    } catch (err) {
        console.log(err);
    }
};

// TODO: NIET DUIDELIJK MORGEN OVERLEGGEN
// quizSchema.methods.setActiveQuestion = async function(questionId) {
//     try {
//         currentQuestionIndex = this.questions.findIndex(e => e._id === questionId);
//         this.questions[currentQuestionIndex].isActive = !this.questions[currentQuestionIndex].isActive;
//         this.save();
//     } catch (err) {
//         console.log(err)
//     }
// };

quizSchema.methods.setClosedQuestion = async function(questionId) {
    try {
        let currentQuestionIndex = this.questions.findIndex(e => e._id == questionId);
        this.questions[currentQuestionIndex].isClosed = true;
        this.save();


        //
        // this.questions.set(0, {
        //     _id: new ObjectId(questionId),
        //     isClosed: true,
        //     isActive: true,
        // });
    } catch (err) {
        console.log(err);
    }
};

quizSchema.plugin(uniqueValidator);

const Quiz = mongoose.model("Quiz", quizSchema);
const Question = mongoose.model('Question', questionSchema);