import Joi from '@hapi/joi';

// *.env validation
export const configValidationSchema = Joi.object({
	PORT: Joi.number().default(3000).required(),
	MONGODB_CONNECTION_URL: Joi.string()
		.default('mongodb://127.0.0.1:27017/finra-short-api')
		.required(),
	JWT_SECRET: Joi.string().required(),
	ADMIN_SECRET: Joi.string().required(),
	SANDBOX_TOKEN: Joi.string().required(),
	SENTRY_DSN: Joi.string().required().uri(),
});
