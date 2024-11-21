import { Field, InputType } from "@nestjs/graphql";
import { SignupUserArgs } from "./signup-user.args";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class SigninUserByPhoneArgs extends SignupUserArgs {}

@InputType()
export class SigninUserByEmailArgs {
  @Field()
  @IsNotEmpty()
  @IsString()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;
}
