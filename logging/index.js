const bunyan = require('bunyan');

function reqSerializer(req) {
    return {
        method: req.method,
        url: req.url,
        headers: req.headers
    };
}

const logger = bunyan.createLogger({
    name: "infiniteCanvas"
});

const reqLogger = bunyan.createLogger({
    name: "incomingRequests",
    serializers: {
        req: reqSerializer
    }
});

const resLogger = bunyan.createLogger({
    name: "outgoingResponses",
    serializers: {
        req: reqSerializer,
        res: bunyan.stdSerializers.res
    }
});

const errLogger = bunyan.createLogger({
    name: "errors",
    serializers: {
        err: bunyan.stdSerializers.err
    }
});

module.exports = { logger, reqLogger, resLogger, errLogger };