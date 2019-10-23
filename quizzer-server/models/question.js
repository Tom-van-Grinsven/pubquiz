const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    }
});

questionSchema.statics.getQuestionsForRound = async function (categories){
    try{
        let questions = await this.aggregate([
                { $match : {category: {$in: [categories[0], categories[1], categories[2]] }}},
                { $sample: { size: 12 } }
            ]);
        return questions;
    } catch (err) {
        console.log(err);
    }
};

const Question = mongoose.model("Question", questionSchema);