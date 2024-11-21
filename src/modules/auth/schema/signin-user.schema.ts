import { ObjectType } from "@nestjs/graphql";
import { SignupUserSchema } from "./signup-user.schema";

@ObjectType()
export class SigninUserSchema extends SignupUserSchema {}
