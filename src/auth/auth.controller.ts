import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../user/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    const { username, password } = loginDto;
    try {
      const token = await this.authService.login(username, password);
      return { token };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ message: string }> {
    try {
      await this.authService.register(registerDto);
      return { message: 'Registration successful' };
    } catch (error) {
      throw new UnauthorizedException('Registration failed');
    }
  }
}
