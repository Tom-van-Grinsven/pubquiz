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


module.exports = {
    sendMessageToWebsocketTeams,
    sendMessageToWebsocketQuizmaster,
    sendMessageToWebsocketScoreboard,
    filterWebsocketConnectionsForDefinitiveTeam,
};