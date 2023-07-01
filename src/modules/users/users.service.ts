import {
  ConflictException,
  ImATeapotException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateRolesDto } from './dtos/update-roles.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const salt = await genSalt();
    const hashedPassword = await hash(createUserDto.password, salt);

    const newUser = this.userRepository.create({
      login: createUserDto.login,
      password: hashedPassword,
      roles: createUserDto.roles,
    });
    return this.userRepository.save(newUser);
  }

  async findOneByLogin(login: string) {
    return this.userRepository.findOne({
      where: { login },
    });
  }

  async createApiKey(login: string) {
    // 1 - find user
    const user = await this.findOneByLogin(login);
    if (!user) {
      throw new NotFoundException('User is not found');
    }

    // 2 - check user privileges.
    if (user.roles.length === 0) {
      throw new ImATeapotException(
        'The user has no more rights than the coffee machine.',
      );
    }

    // 3 - Generate API key
    const apiKey = randomBytes(32).toString('hex');

    // 4 - Hash API key
    const salt = await genSalt();
    const hashedKey = await hash(apiKey, salt);

    // 5 - Store Hashed API key in users collection
    user.apiKey = hashedKey;
    await this.userRepository.update({ id: user.id }, user);

    // 6 - Return API key
    return { apiKey: `${login}:${apiKey}` };
  }

  listAllUsers() {
    return this.userRepository.find({});
  }

  async updateRoles(updateRolesDto: UpdateRolesDto) {
    // Check roles. They should contains only predefined values
    const { login, role } = updateRolesDto;

    // TODO: if role === 'admin' checks if one allReady exists. Limit admin users by 1
    if (role === 'admin') {
      throw new ConflictException('You can not set admin roles via request');
    }

    const user = await this.findOneByLogin(login);

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    if (user.roles.includes(role)) {
      throw new ConflictException(
        `'${role}' role is already exists in user object`,
      );
    }

    user.roles.push(role);
    return this.userRepository.update({ id: user.id }, user);
  }
}
