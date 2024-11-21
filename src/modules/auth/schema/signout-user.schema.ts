import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SignoutUserSchema {
  @Field(() => String)
  message: string;
}
