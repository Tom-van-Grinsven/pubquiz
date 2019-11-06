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
    secret: 'f`lN]F/XuT+gsu2E0GwC#?jY<l}2cTRg]\\Qq{;!gS$CvFnq$v^*vCf&%%H=/657,',
    resave: false
});

app.use(sessionParser);
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.setHeader('Content-Type', 'Application/JSON');
    next();
});

app.use('/', async function(req, res, next) {
    req.websocketServer = websocketServer;
    next();
});

const httpServer      = http.createServer();

const websocketServer = new ws.Server({ noServer: true });

httpServer.on('upgrade', (req, networkSocket, head) => {
    sessionParser(req, {}, () => {


        if(req.session.quizCode || req.session.account || req.session.team) {

            websocketServer.handleUpgrade(req, networkSocket, head, newWebSocket => {
                websocketServer.emit('connection', newWebSocket, req);
            });
        } else {
            networkSocket.destroy();
        }
    });
});

websocketServer.on('connection', (socket, req) => {
    socket.session = req.session;
});

app.use('/quizzes', quizRouter);
app.use('/categories', categoryRouter);
app.use('/accounts', accountRouter);
app.use('/sessions', sessionsRouter);

const dbName = "quizzer";

httpServer.on('request', app);

httpServer.listen(3000, function() {
    mongoose.connect(`mongodb://quizzer-user:supers3cretp4assword!@104.248.87.211:27017/${dbName}`,  {useNewUrlParser: true }, () => {
    });
});

app.use( (err, req, res, next) => {
    return res.status(500).send('Server Error')
});

module.exports = app;