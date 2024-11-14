import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  ValidationPipe,
} from "@nestjs/common";
import { DoctorsModule } from "../doctors/doctors.module";
import { ConfigModule } from "@nestjs/config";
import envConfig from "../../configs/env.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeormConfig } from "../../configs/typeorm.config";
import { APP_PIPE, APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { cacheConfig } from "../../configs/cache.config";
import { CacheModule } from "@nestjs/cache-manager";
import helmet from "helmet";
import * as cookieParser from "cookie-parser";

@Module({
  imports: [
    DoctorsModule,
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 10 }]),
    ConfigModule.forRoot(envConfig()),
    TypeOrmModule.forRoot(typeormConfig()),
    CacheModule.registerAsync(cacheConfig()),
  ],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {
  constructor(consumer: MiddlewareConsumer) {
    consumer
      .apply(helmet(), cookieParser())
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
