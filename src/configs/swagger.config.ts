import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import * as basicAuth from "express-basic-auth";

export const swaggerConfigInit = (app: INestApplication) => {
  const { BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD } = process.env;

  //* Set basic auth for swagger
  app.use(
    ["/swagger"],
    basicAuth({
      challenge: true,
      users: {
        [BASIC_AUTH_USERNAME]: BASIC_AUTH_PASSWORD,
      },
    })
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("med reservation system")
    .setDescription("Patient appointment booking system")
    .setVersion("0.0.1")
    .addBearerAuth(swaggerAuthConfig(), "Authorization")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup("swagger", app, document);
};

function swaggerAuthConfig(): SecuritySchemeObject {
  return {
    scheme: "bearer",
    type: "http",
    in: "header",
    bearerFormat: "JWT",
  };
}
