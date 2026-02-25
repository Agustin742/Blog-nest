import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { IProfileResponse } from './types/profileResponse.interface';
import { ProfileType } from './types/profile.type';
import { FollowEntity } from './following.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async getProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({
      where: {
        username: profileUsername,
      },
    });

    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    let isFollowed = false;

    if (currentUserId) {
      const follow = await this.followRepository.findOne({
        where: {
          followerId: currentUserId,
          followingId: profile.id,
        },
      });

      isFollowed = Boolean(follow);
    }

    return { ...profile, following: isFollowed };
  }

  async followProfile(
    currentUserId: number,
    followingUsername: string,
  ): Promise<ProfileType> {
    const followingProfile = await this.userRepository.findOne({
      where: {
        username: followingUsername,
      },
    });

    if (!followingProfile) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    const follow = await this.followRepository.findOne({
      where: {
        followerId: currentUserId,
        followingId: followingProfile.id,
      },
    });

    if (currentUserId === followingProfile.id) {
      throw new HttpException(
        'You can not follow yourself',
        HttpStatus.BAD_GATEWAY,
      );
    }

    if (!follow) {
      const newFollow = new FollowEntity();
      newFollow.followerId = currentUserId;
      newFollow.followingId = followingProfile.id;
      await this.followRepository.save(newFollow);
    }

    return { ...followingProfile, following: true };
  }

  generateProfileResponse(profile: ProfileType): IProfileResponse {
    delete profile?.password;
    delete profile?.email;
    return { profile };
  }
}
