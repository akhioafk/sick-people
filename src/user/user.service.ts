import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async resetIssuesFlag(): Promise<number> {
    const usersWithIssues = await this.usersRepository.count({
      where: { problems: true },
    });
    await this.usersRepository.update({}, { problems: false });
    return usersWithIssues;
  }
}
