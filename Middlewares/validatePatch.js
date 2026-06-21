const joi = require('joi');

const validatePatch = (req, res, next) => {
    const schema = joi.object({
        task: joi.string().min(3).max(300).optional().empty(''),
        completed: joi.boolean().optional() 
    });

    const {error} = schema.validate(req.body);
    if (error) return res.status(400).json({error: error.details[0].message});
    next();
}

module.exports = validatePatch;