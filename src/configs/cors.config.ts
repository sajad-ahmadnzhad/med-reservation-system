import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export default (): CorsOptions => {
  const ALLOWED_ORIGINS: string[] =
    JSON.parse(process.env.ALLOWED_ORIGINS as string) || [];

  return {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  };
};
