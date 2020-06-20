const validateBody = (schema) => {
    return (req, res, next) => {
        const valid = schema.validate(req.body);
        if (!valid.error) {
            next();
        } else {
            res.status(400).json({ error: valid.error.details[0].message })
        }
    }
}


module.exports = { validateBody };