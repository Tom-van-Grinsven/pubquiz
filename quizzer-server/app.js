const express           = require('express');
const ws                = require('ws');
const session           = require('express-session');
const bodyParser        = require('body-parser');
const http              = require('http');
const mongoose          = require('mongoose');
const cors              = require('cors');

const quizRouter        = require('./routes/quizzes');
const categoryRouter    = require('./routes/categories');
const accountRouter     = require('./routes/accounts');
const sessionsRouter    = require('./routes/sessions');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.options("*", cors({ origin: true, credentials: true }));

const sessionParser = session({
    saveUninitialized: false,
    secret: 'littlelayerofsecurity',
    resave: false
});

app.use(sessionParser);
app.use(bodyParser.json());

app.use('/', async function(req, res, next) {
    req.websocketServer = websocketServer;
    next();
});

const httpServer      = http.createServer();

const websocketServer = new ws.Server({ noServer: true });

httpServer.on('upgrade', (req, networkSocket, head) => {
    sessionParser(req, {}, () => {


        if(req.session.quizCode || req.session.account || req.session.team) {

            console.log(req.session);

            websocketServer.handleUpgrade(req, networkSocket, head, newWebSocket => {
                websocketServer.emit('connection', newWebSocket, req);
            });
        } else {
            networkSocket.destroy();
        }

        // if(req.session.quizCode === undefined ){
        //     console.log("Geen quizcode jammerdebammer");
        //     networkSocket.destroy();
        //     return;
        // } else if (req.session.account === undefined && req.session.team === undefined) {
        //     console.log("Geen account of team jammerdebammer");
        //     networkSocket.destroy();
        //     return;
        // }


    });
});

websocketServer.on('connection', (socket, req) => {
    socket.session = req.session;

    // TODO: andere manier van het bijhouden van websockets <--> quiz;

    // if(websocketServer.quizClients === undefined){
    //     websocketServer.quizClients = {};
    // }
    // if(websocketServer.quizClients[req.quiz.code] === undefined){
    //     websocketServer.quizClients[req.quiz.code] = [];
    // }
    // websocketServer.quizClients[req.quiz.code].push(socket);
});

app.use('/quizzes', quizRouter);
app.use('/categories', categoryRouter);
app.use('/accounts', accountRouter);
app.use('/sessions', sessionsRouter);

const dbName = "quizzer";

httpServer.on('request', app);

httpServer.listen(3000, function() {
    mongoose.connect(`mongodb://quizzer-user:supers3cretp4assword!@104.248.87.211:27017/${dbName}`,  {useNewUrlParser: true }, () => {
        console.log(`game server started on port ${httpServer.address().port}`);
    });
});