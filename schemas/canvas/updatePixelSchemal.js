const Joi = require('@hapi/joi');

const schema = Joi.object({
    x: Joi.number().required,
    y: Joi.number().required,
    colour: Joi.string().required,
    userId: Joi.number()
}).meta({ className: "updatePixelSchema" });


module.exports = schema;