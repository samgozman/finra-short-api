import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../modules/users/users.service';
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

    const salt = await genSalt();
    const hashedPassword = await hash(pass, salt);

    const user = this.usersService.createNewInstance({
      login,
      pass: hashedPassword,
    });
    return user.save();
  }

  async login(credentials: AuthCredentialsDto): Promise<TokenDto> {
    const { login, pass } = credentials;
    const user = await this.usersService.findOne({ login });

    if (user && (await compare(pass, user.pass))) {
      const payload: JwtPayload = { _id: user._id };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
