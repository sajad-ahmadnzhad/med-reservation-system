import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  NestModule,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import envConfig from "../../configs/env.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeormConfig } from "../../configs/typeorm.config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { cacheConfig } from "../../configs/cache.config";
import { CacheModule } from "@nestjs/cache-manager";
import * as cookieParser from "cookie-parser";
import { AwsSdkModule } from "nest-aws-sdk";
import { awsSdkConfig } from "../../configs/awsSdk.config";
import { GraphQLModule } from "@nestjs/graphql";
import graphqlConfig from "../../configs/graphql.config";
import { ApolloDriverConfig } from "@nestjs/apollo";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "../auth/auth.module";
import { BasicAuthMiddleware } from "../../common/middlewares/basicAuth.middleware";

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 10 }]),
    ConfigModule.forRoot(envConfig()),
    TypeOrmModule.forRoot(typeormConfig()),
    CacheModule.registerAsync(cacheConfig()),
    AwsSdkModule.forRoot(awsSdkConfig()),
    GraphQLModule.forRoot<ApolloDriverConfig>(graphqlConfig()),
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
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
