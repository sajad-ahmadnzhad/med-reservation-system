import { ConfigModuleOptions } from "@nestjs/config";
import * as Joi from "joi";
import * as path from "path";

export default (): ConfigModuleOptions => {
  return {
    isGlobal: true,
    envFilePath: path.join(process.cwd(), ".env"),
    validate(config: Record<string, any>) {
      const schema = Joi.object({
        PORT: Joi.number().default(3000),
        DB_PORT: Joi.number().min(1000).required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNCHRONIZE: Joi.number().allow(0, 1).required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        BASIC_AUTH_USERNAME: Joi.string().required(),
        BASIC_AUTH_PASSWORD: Joi.string().required(),
      }).unknown(true);

      const { error, value } = schema.validate(config);

      if (error) {
        console.error(`Env config validation error: ${error.message}`);
        process.exit(1);
      }

      return value;
    },
  };
};
