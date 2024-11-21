import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as basicAuth from "express-basic-auth";

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD } = process.env;

    basicAuth({
      users: { [BASIC_AUTH_USERNAME as string]: BASIC_AUTH_PASSWORD as string },
      challenge: true,
    })(req, res, next);
  }
}
