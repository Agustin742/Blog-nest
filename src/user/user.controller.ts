import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { IUserResponse } from './types/userResponse.interface';
import { LoginDto } from './dto/loginUser.dto';
import type { AuthRequest } from '../types/expressRequest.interface';
import { User } from './decorator/user.decorator';
import { AuthGuard } from './guards/user.guard';
import { UpdateUserDto } from './dto/updateUserDto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<IUserResponse> {
    return await this.userService.createuser(createUserDto);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body('user') loginUserDto: LoginDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.generateUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateUser(
    @User('id') id: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<IUserResponse> {
    const updateUser = await this.userService.updateUser(id, updateUserDto);
    return this.userService.generateUserResponse(updateUser);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async getCurrentUser(@User() user): Promise<IUserResponse> {
    return this.userService.generateUserResponse(user);
  }
}
