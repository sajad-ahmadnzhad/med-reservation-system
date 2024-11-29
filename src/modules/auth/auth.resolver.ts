import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { User } from "./entities/user.entity";
import { SignupUserArgs } from "./args/signup-user.args";
import {
  SigninUserByPhoneArgs,
  SigninUserByEmailArgs,
} from "./args/signin-user.args";
import { RefreshTokenArgs } from "./args/refresh-token.args";
import { SignoutUserArgs } from "./args/signout-user.args";
import { SignupUserSchema, SigninUserSchema, RefreshTokenSchema, SignoutUserSchema, ForgotPasswordSchema } from "./auth.schema";
import { ForgotPasswordArgs } from "./args/forgot-password.args";

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Query(() => User)
  findAll() {
    return this.authService.findAll();
  }

  @Mutation(() => SignupUserSchema)
  signup(@Args("signupInput") signupInput: SignupUserArgs) {
    return this.authService.signupUser(signupInput);
  }

  @Mutation(() => SigninUserSchema)
  signinByPhone(@Args("signinInput") signinInput: SigninUserByPhoneArgs) {
    return this.authService.signinByPhone(signinInput);
  }

  @Mutation(() => SigninUserSchema)
  signinByEmail(@Args("signinInput") signinInput: SigninUserByEmailArgs) {
    return this.authService.signinByEmail(signinInput);
  }

  @Mutation(() => RefreshTokenSchema)
  refreshToken(@Args("refreshTokenInput") refreshTokenInput: RefreshTokenArgs) {
    return this.authService.refreshToken(refreshTokenInput.refreshToken);
  }

  @Mutation(() => SignoutUserSchema)
  signout(@Args("signoutInput") signoutInput: SignoutUserArgs) {
    return this.authService.signout(signoutInput);
  }

  @Mutation(() => ForgotPasswordSchema)
  forgotPassword(@Args('forgotPasswordInput') forgotPasswordInput: ForgotPasswordArgs) {
    return this.authService.forgotPassword(forgotPasswordInput)
  }
}
