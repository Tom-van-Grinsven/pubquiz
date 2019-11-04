let wsConnection = new WebSocket('ws://localhost:3000');

wsConnection.onopen = function(arg) {
    //TODO Complete this event handler
    console.log(" Client heeft connectie ");
};

wsConnection.onmessage = function(arg){
    console.log(" nu zou je opnieuw moeten http requesten naar een of ander endpoint ");
    let message = JSON.parse(arg.data);
    console.log(message);
    addMessageItem(message.message);
};

wsConnection.onclose = function(arg){
    console.log(" Connectie wordt nu gesloten ");
    wsConnection.close();
    wsConnection = null;
};

/**
 * Function for handling form submissions
 */
document.getElementById("messageForm").addEventListener( "submit", function(eventInfo) {
    eventInfo.preventDefault();
    console.log("SUBMIT FORM");
    sendData();
});


function sendData() {
    var dataObject = {
        teamName: document.getElementById("teamNameField").value,
        quizCode: document.getElementById("quizNameField").value
    };

    let jsonStr = JSON.stringify(dataObject);
    wsConnection.send(jsonStr);
    console.log("SENT DATA:", jsonStr );
}

function addMessageItem(text) {
    var el = document.createElement("li");
    el.innerHTML = text;
    document.getElementById("messageList").appendChild(el);
}