import Joi from 'joi';

// *.env validation
export const configValidationSchema = Joi.object({
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  ADMIN_SECRET: Joi.string().required(),
  SENTRY_DSN: Joi.string().required().uri(),
  SENTRY_TRACE_RATE: Joi.number().required().default(1.0),
});
