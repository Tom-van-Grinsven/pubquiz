const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

require('./models/question.js');
require('./models/quiz.js');

const dbName = 'quizzer';

const db = mongoose.connection;
const Question = mongoose.model('Question');
const Quiz = mongoose.model('Quiz');



mongoose.connect(`mongodb://localhost:27017/${dbName}`,  {useNewUrlParser: true } ).then(() => {
    return seedQuestion();
}).then(() => {
    return seedQuiz();
}).catch(err => {
    console.log(err);
}).then(() => {
    db.close();
});


seedQuestion = async () => {
    //await Question.deleteMany();

    let questions = await Question.find({});

    if(questions.length === 0){
        const fileName = path.join('../vragen', 'Questions.json');
        const result = await readFileP(fileName);
        await Question.insertMany(JSON.parse(result));
    }
};

seedQuiz = async () => {
    await Quiz.deleteMany();

    await Quiz.insertMany([{
            code: "code",
            naam: "De eerste Quiz",
            teams: [{teamName: "Harry's Doner", points: 5},
                {teamName: "Zuipschuiten", points: 6}],
            isActive: 0,
            roundNumber: 1,
            questions: [{_id: "5db183258966e72e740ae066", isActive: 1, isClosed: 0}],
            answeredQuestions: {
                _id: "5db183258966e72e740ae066",
                answers: [
                    {
                        teamName: "Harry's Doner",
                        givenAnswer: "Antwoord",
                        isRight: false
                    },
                    {
                        teamName: "Zuipschuiten",
                        givenAnswer: "Geen idee",
                        isRight: true
                    }
                ]
            }
        }]
    )
};

readFileP = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};