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
  file: Joi.any()
    .meta({ type: 'file' })
    .custom((value, helpers) => {
      console.log('value:', value);
      const allowedExtension = ['jpg', 'png', 'jpeg']; 
      const file = value;
      if (!file) {
        return helpers.error('any.required');
      }
      if (!allowedExtension.some(ext => file.type.endsWith(ext))) {
        return helpers.error('file.image');
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        return helpers.error('file.size');
      }
      return value; 
    })
    .required()
});

export default schema;
