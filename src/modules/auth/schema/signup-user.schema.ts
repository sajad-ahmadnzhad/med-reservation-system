import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class SignupUserSchema {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  message: string;
}
