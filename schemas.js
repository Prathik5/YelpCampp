const Joi = require("joi");
module.exports.campgroundSchema = Joi.object({
  campground: Joi.object()
    .required({
      title: Joi.string().required(),
      price: Joi.number().required().min(0),
      // image: Joi.string().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
    })
    .required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object()
    .required({
      body: Joi.string().required(),
      rating: Joi.number().required().min(0).max(10),
    })
    .required(),
});
