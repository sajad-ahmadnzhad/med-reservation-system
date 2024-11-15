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
import helmet from "helmet";
import * as cookieParser from "cookie-parser";
import { AwsSdkModule } from "nest-aws-sdk";
import { awsSdkConfig } from "../../configs/awsSdk.config";
import { GraphQLModule } from "@nestjs/graphql";
import graphqlConfig from "../../configs/graphql.config";
import { ApolloDriverConfig } from "@nestjs/apollo";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 10 }]),
    ConfigModule.forRoot(envConfig()),
    TypeOrmModule.forRoot(typeormConfig()),
    CacheModule.registerAsync(cacheConfig()),
    AwsSdkModule.forRoot(awsSdkConfig()),
    GraphQLModule.forRoot<ApolloDriverConfig>(graphqlConfig()),
    AuthModule
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
      .apply(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
      scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
      frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
    },
  },
}), cookieParser())
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
