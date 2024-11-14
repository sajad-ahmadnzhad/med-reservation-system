import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DoctorsModule } from "../doctors/doctors.module";
import { ConfigModule } from "@nestjs/config";
import * as path from "path";

@Module({
  imports: [
    DoctorsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(process.cwd(), ".env"),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
