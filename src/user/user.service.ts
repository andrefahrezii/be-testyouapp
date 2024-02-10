import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UserService {
  async getAllUsers(excludeUsername: string): Promise<any[]> {
    try {
      const allUsers = await User.find();
      return allUsers;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Unable to fetch user list');
    }
  }

  async createProfile(username: string, profileDto: any): Promise<void> {
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        existingUser.profile = profileDto;
        await existingUser.save();
      } else {
        throw new UnauthorizedException('User not found');
      }
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Profile creation failed');
    }
  }

  async getProfile(username: string): Promise<any> {
    try {
      const userProfile = await User.findOne({ username });
      if (userProfile) {
        return userProfile.profile;
      } else {
        throw new UnauthorizedException('User not found');
      }
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Profile not found');
    }
  }

  async updateProfile(username: string, profileDto: any): Promise<void> {
    try {
      await User.updateOne({ username }, { profile: profileDto });
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Profile update failed');
    }
  }
}
