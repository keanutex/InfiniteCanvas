const redis = require('./redis');

require('dotenv-flow').config({
    default_node_env: 'development'
});

async function startUp() {


    const server = require('http').createServer();
    const ioMain = require('socket.io')(server.listen(3030));

    const bodyParser = require('body-parser');
    const canvasModule = require('./modules/canvas');
    const accountModule = require('./modules/account');
    const swaggerUi = require('swagger-ui-express');
    const specs = require('./swagger/swagger');
    const express = require('express');
    const app = express();
    const cors = require('cors');
    
    await redis.loadDbIntoRedis();

    app.use(cors());
    app.use(bodyParser.json());

    ioMain.sockets.on('connection', socket => {
        console.log("new client");
        // get that socket and listen to events

        //socket.emit('newData', "connected");

        socket.on('sendnewData', () => {
            console.log("new data")
          socket.emit('newData', "connected");
        });
    });

    app.use(function(reqSocket, resSocket, next){
        reqSocket.io = ioMain;
        next();
      });

    const { reqLogger, resLogger, errLogger } = require('./logging');
    app.use((req, res, next) => {
        res.once("finish", () => {
            resLogger.info({ res, req }, "outgoing response");
        });
        next();
    });
    app.use((req, res, next) => {
        reqLogger.info({ req }, "incoming request");
        next();
    });


    app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(specs));
    app.use('/account', accountModule(app));
    app.use('/canvas', canvasModule(app));

    app.use((err, req, res, next) => {
        errLogger.error({ err }, "server error occurred");
        if (res.statusCode == 500)
            res.json({ message: "Internal server error" });
        if (res.statusCode == 404)
            res.json({ message: "Resource Not Found" })
        next();
    });

    app.listen(process.env.PORT);   

}

startUp()
