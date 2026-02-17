import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { IUserResponse } from './types/userResponse.interface';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createuser(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);

    const savedUser = await this.userRepository.save(newUser);

    return this.generateUserResponse(savedUser);
  }

  generateToken(user: UserEntity): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      secret,
    );
  }

  generateUserResponse(user: UserEntity): IUserResponse {
    return {
      user: {
        ...user,
        token: this.generateToken(user),
      },
    };
  }
}
