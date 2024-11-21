import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  NestModule,
  ValidationPipe,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import envConfig from "../../configs/env.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeormConfig } from "../../configs/typeorm.config";
import { cacheConfig } from "../../configs/cache.config";
import { CacheModule } from "@nestjs/cache-manager";
import * as cookieParser from "cookie-parser";
import { AwsSdkModule } from "nest-aws-sdk";
import { awsSdkConfig } from "../../configs/awsSdk.config";
import { GraphQLModule } from "@nestjs/graphql";
import graphqlConfig from "../../configs/graphql.config";
import { ApolloDriverConfig } from "@nestjs/apollo";
import { AuthModule } from "../auth/auth.module";
import { BasicAuthMiddleware } from "../../common/middlewares/basicAuth.middleware";
import { APP_PIPE } from "@nestjs/core";

@Module({
  imports: [
    ConfigModule.forRoot(envConfig()),
    TypeOrmModule.forRoot(typeormConfig()),
    CacheModule.registerAsync(cacheConfig()),
    AwsSdkModule.forRoot(awsSdkConfig()),
    GraphQLModule.forRoot<ApolloDriverConfig>(graphqlConfig()),
    AuthModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser())
      .forRoutes({ path: "*", method: RequestMethod.ALL })
      .apply(BasicAuthMiddleware)
      .forRoutes({ path: "graphql", method: RequestMethod.GET });
  }
}
