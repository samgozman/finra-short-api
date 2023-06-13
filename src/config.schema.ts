import Joi from 'joi';

// *.env validation
export const configValidationSchema = Joi.object({
  MONGODB_URL: Joi.string().default('mongodb').required(),
  MONGODB_NAME: Joi.string().default('finra-short-api').required(),
  MONGODB_PORT: Joi.string().default('27017').required(),
  MONGO_INITDB_ROOT_USERNAME: Joi.string().default('admin').required(),
  MONGO_INITDB_ROOT_PASSWORD: Joi.string().default('admin').required(),
  JWT_SECRET: Joi.string().required(),
  ADMIN_SECRET: Joi.string().required(),
  SENTRY_DSN: Joi.string().required().uri(),
  SENTRY_TRACE_RATE: Joi.number().required().default(1.0),
  ANALYZER_URL: Joi.string().required().uri().default('http://analyzer:3030/run'),
});
