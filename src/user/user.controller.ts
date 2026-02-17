import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async createUser(@Body('user') createUserDto: CreateUserDto) {
    return await this.userService.createuser(createUserDto);
  }
}
