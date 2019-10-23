const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

require('./models/question.js');

const dbName = 'quizzer';

const db = mongoose.connection;
const Question = mongoose.model('Question');

mongoose.connect(`mongodb://localhost:27017/${dbName}`,  {useNewUrlParser: true } ).then(() => {
    return seedQuestion();
}).catch(err => {
    console.log(err);
}).then(() => {
    db.close();
});

seedQuestion = async () => {
    await Question.deleteMany();

    const fileName = path.join('../vragen', 'Questions.json');
    const result = await readFileP(fileName);
    await Question.insertMany(JSON.parse(result));
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



