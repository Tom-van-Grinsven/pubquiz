const mongoose          = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');

const quizSchema = new mongoose.Schema({
    code: {type: String, unique: true, maxLength: 6},
    naam: {type: String, required: true},
    teams: [{teamName: {type: String, unique: true, points: Number}}],
    isActive: {type: Boolean, required: true, default: false},
    roundNumber: {type: Number, required: true, default: 1},
    questionNumber: {type: Number, required: true, default: 1},
    questions: [
        {
            questionId: {type: mongoose.Schema.Types.ObjectId, ref: 'Question', unique: true},
            // roundNumber: Number,
            isActive: {type: Boolean, required: true, default: false},
            isClosed: {type: Boolean, required: true, default: false},
        }
    ],
    answeredQuestions: [
        {
            questionId: {type: mongoose.Schema.Types.ObjectId, ref: 'Question'},
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

quizSchema.plugin(uniqueValidator);
const Quiz = mongoose.model("Quiz", quizSchema);