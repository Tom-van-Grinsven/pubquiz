const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    code: {String, unique: true, maxLength: 6},
    naam: {type: String, required: true,},
    teams: [{teamName: String, unique: true, points: Number}],
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

// quizSchema.methods.getActiveQuestion();
// quizSchema.methods.setCategories(categories);
// quizSchema.methods.addJoinedTeamToQuiz(team);
// quizSchema.methods.getJoinedTeamsOfQuiz();
// quizSchema.methods.setDefinitiveTeamsForQuiz(teams);
// quizSchema.methods.setActiveQuestion(questionId);
// quizSchema.methods.setClosedQuestion();
// quizSchema.methods.setTeamAnswerForQuestion(team, answer);
// quizSchema.methods.getGivenAnswers();
// quizSchema.methods.judgeGivenAnswers(answers);
// quizSchema.methods.getScores();

const Quiz = mongoose.model("Quiz", quizSchema);

