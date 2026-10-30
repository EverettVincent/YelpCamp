// schemas.js
import Joi from "joi";

const campgroundSchema = Joi.object({
  // campground: Joi.object({
  formTitle: Joi.string().required(),
  formLocation: Joi.string().required(),
  formImage: Joi.string(),
  formDescription: Joi.string().required(),
  formPrice: Joi.number().min(0).required(),
  // }).required(),
});

export { campgroundSchema };

const reviewSchema = Joi.object({
  // review: Joi.object({
  formRating: Joi.number().required().min(1).max(5),
  formBody: Joi.string().required(),
  // }).required(),
});

export { reviewSchema };
