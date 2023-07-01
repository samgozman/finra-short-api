import Joi from 'joi';

// *.env validation
export const configValidationSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  ADMIN_SECRET: Joi.string().required(),
  SENTRY_DSN: Joi.string().required().uri(),
  SENTRY_TRACE_RATE: Joi.number().required().default(1.0),
  ANALYZER_URL: Joi.string().required().uri().default('http://analyzer:3030/run'),
  ANALYZER_TOKEN: Joi.string().required(),
});
