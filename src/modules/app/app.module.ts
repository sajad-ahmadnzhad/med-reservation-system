import { Module } from "@nestjs/common";
import { DoctorsModule } from "../doctors/doctors.module";
import { ConfigModule } from "@nestjs/config";
import envConfig from "../../configs/env.config";

@Module({
  imports: [
    DoctorsModule,
    ConfigModule.forRoot(envConfig()),
  ],
})
export class AppModule {}
