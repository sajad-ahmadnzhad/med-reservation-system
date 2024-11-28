import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordArgs {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ format: "gmail", type: "string", required: true })
  email: string;
}
