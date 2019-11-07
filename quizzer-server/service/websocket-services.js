function sendMessageToWebsocketTeams(req, message) {
    req.websocketServer.clients.forEach((client) => {
        if(client.session && client.session.team && req.quiz.code === client.session.quizCode){
            client.send(JSON.stringify({type: message}));
        }
    })
}

function sendMessageToWebsocketQuizmaster(req, message){
    req.websocketServer.clients.forEach((client) => {
        if(client.session && client.session.account && req.quiz.code === client.session.quizCode){
            client.send(JSON.stringify({type: message}));
        }
    })
}

function sendMessageToWebsocketScoreboard(req, message){
    req.websocketServer.clients.forEach((client) => {
        if(client.session && !client.session.team && !client.session.account && req.quiz.code === client.session.quizCode){
            client.send(JSON.stringify({type: message}));
        }
    })
}

function filterWebsocketConnectionsForDefinitiveTeam(req, teams){
    req.websocketServer.clients.forEach((client) => {
        if(client.session && client.session.team && client.session.quizCode === req.quiz.code){
            if(!teams.includes(client.session.team.teamName)){
                client.send(JSON.stringify({type: 'TEAM_REJECTED'}));
                client.close();
                client.session.destroy();
                client.session = null;
            }
        }
    });
}

module.exports = {
    sendMessageToWebsocketTeams,
    sendMessageToWebsocketQuizmaster,
    sendMessageToWebsocketScoreboard,
    filterWebsocketConnectionsForDefinitiveTeam,
};