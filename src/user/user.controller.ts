import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  UnauthorizedException,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { JwtAuthGuard } from './jwt-auth.guard';

import { ApiTags, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { Profile } from './user.model';

@UseGuards(JwtAuthGuard)
@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('createProfile')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Profile has been created successfully',
    type: Object,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Profile creation failed',
  })
  async createProfile(
    @Req() req: any,
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string; data?: Profile }> {
    try {
      const createdProfile = await this.userService.createProfile(
        req.user.username,
        createUserDto,
      );

      return { message: 'Profile has been created' };
    } catch (error) {
      throw new UnauthorizedException('Profile creation failed');
    }
  }
  //

  @Get('getProfile')
  @ApiResponse({
    status: 200,
    description: 'Profile has been found successfully',
    type: Object,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Profile not found',
  })
  async getProfile(
    @Req() req: any,
  ): Promise<{ message: string; data?: Profile }> {
    try {
      const userProfile = await this.userService.getProfile(req.user.username);

      const responseData = {
        // email: userProfile.email,
        // username: userProfile.username,
        name: userProfile.name || '',
        birthday: userProfile.birthday || '',
        horoscope: 'Error',
        height: userProfile.height || 0,
        weight: userProfile.weight || 0,
        interests: userProfile.interests || [],
        photoProfile: userProfile.photoProfile || '',
      };

      return {
        message: 'Profile has been found successfully',
        data: responseData,
      };
    } catch (error) {
      throw new UnauthorizedException('Profile not found');
    }
  }

  @Put('updateProfile')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Profile has been updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Profile update failed',
  })
  async updateProfile(
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ message: string }> {
    try {
      await this.userService.updateProfile(req.user.username, updateUserDto);
      return { message: 'Profile has been updated' };
    } catch (error) {
      throw new UnauthorizedException('Profile update failed');
    }
  }

  @Get('getAllUsers')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Profile has been updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Profile update failed',
  })
  async getAllUsers(
    @Req() req: any,
  ): Promise<{ message: string; data?: any[] }> {
    try {
      const allUsers = await this.userService.getAllUsers(req.user.username);

      const responseData = allUsers
        .filter((user) => user.username !== req.user.username)
        .map((user) => ({
          username: user.username,
          birthday:
            user.profile && user.profile.birthday ? user.profile.birthday : '',
          height: user.profile && user.profile.height ? user.profile.height : 0,
          weight: user.profile && user.profile.weight ? user.profile.weight : 0,
          interests:
            user.profile && user.profile.interests
              ? user.profile.interests
              : [],
          photoProfile:
            user.profile && user.profile.photoprofile
              ? user.profile.photoprofile
              : '',
        }));

      return {
        message: 'List of users excluding the authenticated user',
        data: responseData,
      };
    } catch (error) {
      throw new UnauthorizedException('Unable to fetch user list');
    }
  }
}
