const swaggerjsDoc = require('swagger-jsdoc');

const options = {
    apis: ['./**/routes/router.js'],
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            description: 'Infinite Canvas API documentation',
            title: 'Infinite Canvas',
            version: '0.0.1'
        }
    }
}

const specs = swaggerjsDoc(options);

module.exports = specs;