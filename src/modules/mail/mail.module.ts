import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { mailConfig } from "../../configs/mail.config";

@Module({
  imports: [
    MailerModule.forRootAsync(mailConfig()),
  ],
  providers: [],
  exports: [MailerModule]
})
export class MailModule {}
