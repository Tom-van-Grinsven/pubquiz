const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

require('./models/question.js');
require('./models/quiz.js');
require('./models/account.js');

const dbName = 'quizzer';

const db = mongoose.connection;
const Question = mongoose.model('Question');
const Quiz = mongoose.model('Quiz');
const Account = mongoose.model('Account');

mongoose.connect(`mongodb://quizzer-user:supers3cretp4assword!@104.248.87.211:27017/${dbName}`,  {useNewUrlParser: true } ).then(() => {
    return seedQuestion();
}).then(() => {
    return seedQuiz();
}).then(() => {
    return seedAccount();
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
            code: "qhhhnt",
            name: "De eerste Quiz",
            teams: [],
            isActive: 0,
            roundNumber: 1,
            questions: [],
            answeredQuestions: {
                answers: [

                ]
            }
        }]
    )
};

seedAccount = async () => {
    await Account.deleteMany();

    let adminAccount = new Account({email:"admin@quiznight.com", password: bcrypt.hashSync("wachtwoord", 10)});
    await Account.insertMany([
        adminAccount
    ])
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