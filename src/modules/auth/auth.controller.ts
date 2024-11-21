import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GoogleOAuthUser } from "./interfaces/auth.interface";
import { Request } from "express";
import { AuthGuard } from "@nestjs/passport"

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get("google/login")
  @UseGuards(AuthGuard("google"))
  googleAuth() {}

  @Get("google/redirect")
  @UseGuards(AuthGuard("google"))
  googleRedirect(@Req() req: Request) {
    return this.authService.googleAuth(req.user as GoogleOAuthUser);
  }
}
