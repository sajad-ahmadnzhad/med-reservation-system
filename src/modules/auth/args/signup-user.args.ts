import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString, Length } from "class-validator";

@InputType()
export class SignupUserArgs {
  @Field()
  @IsNotEmpty()
  @IsString()
  @Length(11, 11)
  phone_number: string;
}
