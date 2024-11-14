import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { PORT = 3000 } = process.env;
  const logger = new Logger()

  await app.listen(PORT, () => {
    logger.log(`Server running on port ${PORT}`)
  });
}
bootstrap();
