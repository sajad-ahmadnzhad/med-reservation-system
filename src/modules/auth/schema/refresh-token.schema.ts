import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RefreshTokenSchema {
  @Field()
  newAccessToken: string;
  @Field()
  message: string;
}
