import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty } from "class-validator";

@InputType()
export class ForgotPasswordArgs {
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;
}
