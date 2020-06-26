//***************************** Configuraion for node
const hostname = '127.0.0.1';

const express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors())
app.use(bodyParser.urlencoded({
        extended: false
    }));
app.use(bodyParser.json());
app.listen(port, hostname, () => {
    console.log('Listening on port', port)
});

app.post('/users/signin', function (req, res) {
    console.log(req.body);
    res.writeHead(200);
    console.log('respose recieved and sent back');
})

