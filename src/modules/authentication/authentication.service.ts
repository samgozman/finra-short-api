import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { TokenDto } from './dtos/token.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(credentials: AuthCredentialsDto) {
    const { login, pass } = credentials;

    return this.usersService.create({
      login,
      password: pass,
    });
  }

  async login(credentials: AuthCredentialsDto): Promise<TokenDto> {
    const { login, pass } = credentials;
    const user = await this.usersService.findOneByLogin(login);

    if (user && (await compare(pass, user.password))) {
      const payload: JwtPayload = { _id: user.id };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
