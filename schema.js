const Joi = require('joi');
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string()
            .required()
            .messages({
                'string.empty': 'Title is required.',
                'any.required': 'Title is a mandatory field.',
            }),
        description: Joi.string().messages({
            'string.base': 'Description must be a string.',
        }),
        image: Joi.string()
            .uri()
            .allow('', null)
            .default(
                "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
            )
            .messages({
                'string.uri': 'Image must be a valid URI.',
            }),
        price: Joi.number()
            .positive()
            .min(0)
            .messages({
                'number.base': 'Price must be a number.',
                'number.positive': 'Price must be a positive value.',
            }),
        location: Joi.string().messages({
            'string.base': 'Location must be a string.',
        }),
        country: Joi.string().messages({
            'string.base': 'Country must be a string.',
        }),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required(),
        createdAt: Joi.date().default(Date.now)  // Default to current date if not provided
    }).required()
});
