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
        // The 'req' parameter contains the HTTP request that is for the upgrade
        // request to the websocket protocol.
        // We can refuse the upgrade request by returning from this function
        // (and closing the networkconnection for this request)
        // if (req.session.account === undefined) {
        //     networkSocket.destroy();
        //     return;
        // }

        if(req.session.quizCode === undefined){
            networkSocket.destroy();
            return;
        } else if (req.session.account === undefined) {
            networkSocket.destroy();
            return;
        }

        //console.log('Session is parsed and we have a User!');

        // Everything is fine. We tell the websocket server to
        // initiate a new websocket connection for this request
        // and emit a new connection event passing in the
        // newly created websocket when the setup is complete
        websocketServer.handleUpgrade(req, networkSocket, head, newWebSocket => {
            websocketServer.emit('connection', newWebSocket, req);
        });
    });
});

websocketServer.on('connection', (socket, req) => {
    socket.on('message', (message) => {
        req.session.reload((err)=>{


            //console.log(req.sessionID);

            // if we don't call reload(), we'll get a old copy
            // of the session, and won't see changes made by
            // Express routes (like '/logout', above)
            //if(err) { throw err };

            // Here we can now use session parameters, because we called the sessionParser
            // in the verifyClient function

            // if( req.session.account == undefined ) {
            //     // The session does not contain the name of a user, so this this client
            //     // has probably logged out.
            //     // We'll simply ignore any messages from this client.
            //     console.log(`Ignoring message from logged out user: "${message}"` );
            //     return;
            // }

            // req.session.messageCounter ++;
            // //console.log(`${req.session.messageCounter}th WS message from ${req.session.userName}: "${message}"`);
            //
            // // broadcast this message to all connected browsers
            // const outMessage = `[${req.session.messageCounter}]: ${message}`;
            websocketServer.clients.forEach(function (client) {
                client.send(JSON.stringify({message: "MESSAGE MAAT"}));
            });
            req.session.save()  // If we don't call save(), Express routes like '/logout' (above)
                                // will not see the changes we make to the session in this socket code.
        })
    });
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