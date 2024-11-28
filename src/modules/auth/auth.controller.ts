import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GoogleOAuthUser } from "./interfaces/auth.interface";
import { Request } from "express";
import { AuthGuard } from "@nestjs/passport"

@Controller("auth")
@UseGuards(AuthGuard("google"))
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get("google/login")
  googleAuth() {}

  @Get("google/redirect")
  googleRedirect(@Req() req: Request) {
    return this.authService.googleAuth(req.user as GoogleOAuthUser);
  }
}
