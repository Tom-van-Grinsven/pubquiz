function sendMessageToWebsocketTeams(req, message) {
    req.websocketServer.clients.forEach((client) => {
        console.log(client.session);
        if(!client.session.account && req.quiz.code === client.session.quizCode){
            client.send(JSON.stringify({type: message}));
        }
    })
}

function sendMessageToWebsocketQuizmaster(req, message){
    req.websocketServer.clients.forEach((client) => {
        if(client.session.account && req.quiz.code === client.session.quizCode){
            client.send(JSON.stringify({type: message}));
        }
    })
}

function sendMessageToWebsocketScoreboard(req, message){
    req.websocketServer.clients.forEach((client) => {
        if(!client.session.team && !client.session.account){
            client.send(JSON.stringify({type: message}));
        }
    })
}

function filterWebsocketConnectionsForDefinitiveTeam(req, teams){
    req.websocketServer.clients.forEach((el) => {
        if(el.session.team && el.session.quizCode === req.quiz.code){
            console.log(el.session.team);
            if(!teams.includes(el.session.team.teamName)){
                el.close();
            }
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
    sendMessageToWebsocketTeams,
    sendMessageToWebsocketQuizmaster,
    sendMessageToWebsocketScoreboard,
    filterWebsocketConnectionsForDefinitiveTeam,
    getPositionPoints,
    getRoundResult,
    sortScoreArray,
    getTeamRoundPositions,
    getValidatedAndClosedRoundQuestions
};