import Joi from "joi";

const schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  date: Joi.string().required(),
  startHour: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9]) (AM|PM)$/)
    .required(),
  finishHour: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9]) (AM|PM)$/)
    .required(),
  country: Joi.string().required(),
  city: Joi.string().required(),
  lat: Joi.number().required(),
  lng: Joi.number().required(),
});

export default schema;
