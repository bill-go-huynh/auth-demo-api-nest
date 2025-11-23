import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(8080),
  DB_URL: Joi.string().optional(),
  DB_HOST: Joi.string().optional(),
  DB_PORT: Joi.number().optional(),
  DB_USERNAME: Joi.string().optional(),
  DB_PASSWORD: Joi.string().optional(),
  DB_DATABASE: Joi.string().optional(),
  SESSION_SECRET: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_SESSION_REDIRECT_URL: Joi.string().required(),
  GOOGLE_JWT_REDIRECT_URL: Joi.string().required(),
  CORS_ORIGINS: Joi.string().default('http://localhost:3000,http://localhost:3001'),
});
