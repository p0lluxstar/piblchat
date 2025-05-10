import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  @Get('verify')
  @UseGuards(JwtAuthGuard)
  async verifyUser(@Req() req: Request) {
    // req.user был установлен в JwtStrategy.validate()
    return {
      valid: true,
      user: req.user,
    };
  }
}
