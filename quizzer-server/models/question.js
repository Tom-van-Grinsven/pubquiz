const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
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

questionSchema.statics.getQuestionsForRound = async function (categories, currentQuizQuestions){
    try{
        console.log(currentQuizQuestions);
        let questions = await this.aggregate([
                { $match : { $and:
                                [
                                    {category:
                                            {$in: [categories[0], categories[1], categories[2]]}
                                    }
                                ,
                                    {_id:
                                            {$nin: currentQuizQuestions}
                                    }
                                ]
                            }
                },
                { $sample: { size: 12 } }
            ]);
        console.log(questions);
        return questions;
    } catch (err) {
        console.log(err);
    }
};

questionSchema.statics.getCategories = async function() {
    try {
        let categories = await this.distinct('category');
        return categories;
    } catch (err) {
        console.log(err);
    }
};

questionSchema.statics.getQuestionsById = async function(questionIdList) {
    try {
        return await Question.find({'_id': {$in: questionIdList}});
    } catch (err) {
        console.log(err);
    }
};

const Question = mongoose.model("Question", questionSchema);

module.exports = questionSchema;