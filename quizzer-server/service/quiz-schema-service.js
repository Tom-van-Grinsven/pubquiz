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
            if (q.category === cat.category) {
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


const getPositionPoints = (position) => {
    return [4, 2, 1, .1][position];
};

const getInitialTeamRoundResult = (teams) => {
    return teams.reduce((acc, team) => {
        return {
            ...acc,
            [team.teamName] : 0
        }
    }, {})
};

const getRoundResult = function (roundQuestions, answeredQuestions, teams) {

    const roundScore = getInitialTeamRoundResult(teams);
    roundQuestions.forEach(question => {
        const teamAnswersToQuestion = answeredQuestions.find(answers => String(answers._id) === String(question._id));
        if (teamAnswersToQuestion !== undefined) {
            teamAnswersToQuestion.answers.forEach(answer => {
                if (answer.isRight === true) {
                    if (!roundScore[answer.teamName]) roundScore[answer.teamName] = 0;
                    roundScore[answer.teamName]++;
                }
            })
        }
    });

    return Object.keys(roundScore).map((team) => {
        return {
            teamName: team,
            correct: roundScore[team]
        }
    })
};

const sortScoreArray = (roundResults, key) => {
    return roundResults.sort((teamA, teamB) => teamB[key] - teamA[key]);
};

const getTeamRoundPositions = (roundResult) => {
    roundResult = sortScoreArray(roundResult, 'correct');

    const positions     = {0: [], 1: [], 2: [], 3: []};
    const lastPosition  = Object.keys(positions).length - 1;

    for (let resultNr = 0; resultNr < roundResult.length; resultNr++) {
        const position = (resultNr < lastPosition ? resultNr : lastPosition);
        positions[position].push(roundResult[resultNr]);
        for (let equalResultNr = (resultNr + 1); equalResultNr < roundResult.length; equalResultNr++) {
            if (roundResult[equalResultNr].correct !== roundResult[position].correct) break;
            positions[position].push(roundResult[equalResultNr]);
            resultNr++;
        }
    }
    return positions;
};

const getValidatedAndClosedRoundQuestions = (questions, roundNr) => {
    return questions.slice((roundNr - 1) * 12, roundNr * 12).filter(question => question.isClosed === true && question.isValidated === true)
};

module.exports = {
    mapQuestionsToOrganizedByCategory,
    getRandomCodeForQuiz,
    getActiveQuestionIndex,
    getCurrentAnsweredQuestionIndexByQuestionId,
    getCurrentAnsweredQuestionAnswerByTeamName,
    saveOrUpdateTeamAnswer,
    formatTeamArrayForMongooseModel,
    getValidatedAndClosedRoundQuestions,
    getPositionPoints,
    getRoundResult,
    sortScoreArray,
    getTeamRoundPositions
};