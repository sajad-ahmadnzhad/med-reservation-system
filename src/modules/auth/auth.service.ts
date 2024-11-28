import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
  forwardRef,
} from "@nestjs/common";
import { SignupUserArgs } from "./args/signup-user.args";
import { User } from "./entities/user.entity";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { RedisCache } from "cache-manager-redis-yet";
import { SignoutUserArgs } from "./args/signout-user.args";
import { JwtService } from "@nestjs/jwt";
import {
  GenerateTokens,
  GoogleOAuthUser,
  RefreshToken,
  SigninUser,
  SignupUser,
} from "./interfaces/auth.interface";
import { AuthMessages } from "../../common/enums/authMessages.enum";
import { Roles } from "../../common/enums/roles.enum";
import * as bcrypt from "bcrypt";
import {
  SigninUserByEmailArgs,
  SigninUserByPhoneArgs,
} from "./args/signin-user.args";
import { UserRepository } from "./auth.repository";
import { randomBytes } from "crypto";
import { LessThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Token } from "./entities/token.entity";
import { ForgotPasswordArgs } from "./args/forgot-password.args";
import { MailerService } from "@nestjs-modules/mailer";
import { ResetPasswordArgs } from "./args/reset-password.args";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly redisCache: RedisCache,
    private readonly userRepository: UserRepository,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @Inject(forwardRef(() => MailerService))
    private readonly mailerService: MailerService
  ) {}

  findAll() {
    return [];
  }

  private async deleteExpiredTokens(): Promise<void> {
    await this.tokenRepository.delete({ createdAt: LessThan(new Date()) });
  }

  private hashPassword(data: string, salt: number): string {
    return bcrypt.hashSync(data, salt);
  }

  private async validateRefreshToken(refreshToken: string): Promise<boolean> {
    const { id } = this.jwtService.decode<{ id: number }>(refreshToken) || {};

    const storedToken = await this.redisCache.get(
      `refreshToken_${id}_${refreshToken}`
    );

    if (!storedToken || storedToken !== refreshToken) {
      throw new BadRequestException(AuthMessages.InvalidRefreshToken);
    }

    return true;
  }

  private async generateTokens(user: User): Promise<GenerateTokens> {
    const payload = { id: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    await this.redisCache.set(
      `refreshToken_${user.id}_${refreshToken}`,
      refreshToken,
      60 * 60 * 24 * 30 * 1000
    );

    return { accessToken, refreshToken };
  }

  async signupUser(input: SignupUserArgs): Promise<SignupUser> {
    const { phone_number } = input;

    const existingUser = await this.userRepository.findByPhone(phone_number);

    if (existingUser) {
      throw new ConflictException(AuthMessages.AlreadyRegistered);
    }

    const isFirstUser = (await this.userRepository.count()) == 0;

    let user = await this.userRepository.createUser({
      full_name: `${Math.random() * 100000}`,
      phone_number,
      role: isFirstUser ? Roles.SUPER_ADMIN : Roles.USER,
    });

    const tokens = await this.generateTokens(user);

    return { message: AuthMessages.SignupUserSuccess, ...tokens };
  }

  async signinByPhone(input: SigninUserByPhoneArgs): Promise<SigninUser> {
    const { phone_number } = input;

    const user = await this.userRepository.findOneBy({ phone_number });

    if (!user) {
      throw new NotFoundException(AuthMessages.NotFoundUser);
    }

    const tokens = await this.generateTokens(user);

    return { message: AuthMessages.SigninUserSuccess, ...tokens };
  }

  async signinByEmail(input: SigninUserByEmailArgs): Promise<SigninUser> {
    const { email, password } = input;

    const user = await this.userRepository.findOne({
      where: { email },
      select: ["password", "id"],
    });

    if (!user) {
      throw new NotFoundException(AuthMessages.NotFoundUser);
    }

    const isValidPassword = await bcrypt.compare(password, user.password || "");

    if (isValidPassword || !user.password) {
      throw new BadRequestException(AuthMessages.InvalidPassword);
    }

    const tokens = await this.generateTokens(user);

    return { message: AuthMessages.SigninUserSuccess, ...tokens };
  }

  async refreshToken(refreshToken: string): Promise<RefreshToken> {
    await this.validateRefreshToken(refreshToken);

    const { id } = this.jwtService.verify<{ id: number }>(refreshToken, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    const newAccessToken = this.jwtService.sign(
      { id },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
      }
    );

    return {
      newAccessToken,
      message: AuthMessages.RefreshTokenSuccess,
    };
  }

  async googleAuth(
    user: GoogleOAuthUser | undefined
  ): Promise<GenerateTokens & { message: string }> {
    if (!user) {
      throw new UnauthorizedException(AuthMessages.GoogleUnauthorized);
    }

    let existingUser = await this.userRepository.findByEmail(user.email);

    const isFirstUser = (await this.userRepository.count()) == 0;

    if (!existingUser) {
      existingUser = await this.userRepository.createUser({
        ...user,
        role: isFirstUser ? Roles.SUPER_ADMIN : Roles.USER,
      });
    }

    const tokens = await this.generateTokens(existingUser);

    return {
      ...tokens,
      message: AuthMessages.AuthenticatedSuccess,
    };
  }

  async signout(input: SignoutUserArgs): Promise<{ message: string }> {
    const { refreshToken } = input;

    let decodeToken: Partial<{ id: number }> = {};

    try {
      decodeToken = this.jwtService.decode<{ id: number }>(refreshToken);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!decodeToken) {
      throw new BadRequestException(AuthMessages.InvalidRefreshToken);
    }

    await this.validateRefreshToken(refreshToken);

    await this.redisCache.del(`refreshToken_${decodeToken.id}_${refreshToken}`);

    return { message: AuthMessages.SignoutSuccess };
  }

  async forgotPassword({ email }: ForgotPasswordArgs) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (!existingUser) {
      throw new NotFoundException(AuthMessages.NotFoundUser);
    }

    await this.deleteExpiredTokens();

    const existingToken = await this.tokenRepository
      .createQueryBuilder("token")
      .leftJoinAndSelect("token.user", "user")
      .andWhere("user.email = :email", { email })
      .getOne();

    if (existingToken) {
      throw new ConflictException(AuthMessages.AlreadySendMail);
    }

    const token = this.tokenRepository.create({
      user: existingUser,
      token: randomBytes(32).toString("hex"),
    });

    const { BASE_URL } = process.env;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      subject: "reset your password",
      html: `<p>Link to reset your password:</p>
        <h1>Click on the link below to reset your password</h1>
        <h2>${BASE_URL}/auth/${existingUser.id}/reset-password/${token.token}</h2>
        `,
    };

    setImmediate(async () => {
      try {
        await this.mailerService.sendMail(mailOptions);
        await this.tokenRepository.save(token);
      } catch (error) {
        await this.tokenRepository.delete({ id: token.id });
        throw new InternalServerErrorException(error.message);
      }
    });

    return AuthMessages.SendedResetPassword;
  }

  async resetPassword(dto: ResetPasswordArgs, userId: number, token: string) {
    await this.deleteExpiredTokens();

    const existingToken = await this.tokenRepository.findOneBy({ token });

    if (!existingToken) {
      throw new NotFoundException(AuthMessages.NotFoundToken);
    }

    const hashPassword = this.hashPassword(dto.password, 12);

    await this.userRepository.update(
      { id: userId },
      { password: hashPassword }
    );

    await this.tokenRepository.delete({ token });
    return AuthMessages.ResetPasswordSuccess;
  }
}
