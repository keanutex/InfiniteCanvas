const swaggerjsDoc = require('swagger-jsdoc');

const options = {
    apis: ['./**/routes/router.js'],
    basePath: '../modules',
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            description: 'Infinite Canvas API documentation',
            title: 'Highway',
            version: '0.0.1'
        }
    }
}

const specs = swaggerjsDoc(options);

module.exports = specs;