import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.userService.createUser(body);
    return await this.userService.buildUserResponse(user);
  }
}
