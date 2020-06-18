
require('dotenv-flow').config({
    default_node_env: 'development'
});

const bodyParser = require('body-parser');
const canvasModule = require('./modules/canvas');
const accountModule = require('./modules/account');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger/swagger');
const express = require('express');
const app = express();
app.use(bodyParser.json());


app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/account', canvasModule(app));
app.use('/canvas', accountModule(app));
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

app.listen(process.env.PORT);

