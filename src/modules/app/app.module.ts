import { Module } from "@nestjs/common";
import { DoctorsModule } from "../doctors/doctors.module";
import { ConfigModule } from "@nestjs/config";
import envConfig from "../../configs/env.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeormConfig } from "../../configs/typeorm.config";

@Module({
  imports: [
    DoctorsModule,
    ConfigModule.forRoot(envConfig()),
    TypeOrmModule.forRootAsync(typeormConfig())
  ],
})
export class AppModule {}
