// auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await User.findOne({ username });

    if (user?.comparePassword(password)) {
      // Rest of the code remains the same
      return user;
    }

    return null;
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };
    return this.generateToken(payload);
  }

  async register(userDto: any): Promise<string> {
    try {
      const existingUser = await User.findOne({
        $or: [{ username: userDto.username }, { email: userDto.email }],
      });

      if (existingUser) {
        throw new ConflictException('Username or email already exists');
      }
      const hashedPassword = await bcrypt.hash(userDto.password, 10);

      const newUser = new User({
        username: userDto.username,
        email: userDto.email,
        password: hashedPassword,
      });
      await newUser.save();

      const payload = { username: newUser.username, sub: newUser.id };
      return this.generateToken(payload);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Username or email already exists');
      } else {
        console.error(error);
        throw new UnauthorizedException('Registration failed');
      }
    }
  }
}
