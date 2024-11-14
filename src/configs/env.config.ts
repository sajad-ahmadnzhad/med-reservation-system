import * as Joi from "joi";
import * as path from "path";

export default () => {
  return {
    isGlobal: true,
    envFilePath: path.join(process.cwd(), ".env"),
    validate(config: Record<string, any>) {
      const schema = Joi.object({
        PORT: Joi.number().default(3000),
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
