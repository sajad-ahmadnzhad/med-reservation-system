import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class SignoutUserArgs {
  @Field()
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
