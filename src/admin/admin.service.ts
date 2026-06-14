import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  getDashboard() {
    return {
      message: 'Admin dashboard',
      timestamp: new Date().toISOString(),
    };
  }

  async getAllUsers() {
    return this.usersRepository.find();
  }
}
