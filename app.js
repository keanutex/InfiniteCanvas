const redis = require('./redis');

require('dotenv-flow').config({
    default_node_env: 'development'
});

async function startUp() {


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
