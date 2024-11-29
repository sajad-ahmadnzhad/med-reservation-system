import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { GoogleStrategy } from "./strategies/google.strategy";
import { AuthController } from "./auth.controller";
import { UserRepository } from "./auth.repository";
import { MailModule } from "../mail/mail.module";
import { Token } from "./entities/token.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token]),
    JwtModule.register({ global: true }),
    MailModule,
  ],
  providers: [AuthResolver, AuthService, GoogleStrategy, UserRepository],
  controllers: [AuthController],
})
export class AuthModule { }
