import { Field, ObjectType } from "@nestjs/graphql";

//* refresh token schema
@ObjectType()
export class RefreshTokenSchema {
    @Field()
    newAccessToken: string;
    @Field()
    message: string;
}

//* signup user schema
@ObjectType()
export class SignupUserSchema {
    @Field()
    accessToken: string;

    @Field()
    refreshToken: string;

    @Field()
    message: string;
}

//* signin user schema
@ObjectType()
export class SigninUserSchema extends SignupUserSchema { }

//* signout user schema
@ObjectType()
export class SignoutUserSchema {
    @Field(() => String)
    message: string;
}

//* forgot password schema
@ObjectType()
export class ForgotPasswordSchema extends SignoutUserSchema { }

