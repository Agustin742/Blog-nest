import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntitty } from './tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntitty)
    private readonly tagRepository: Repository<TagEntitty>,
  ) {}

  async getAll() {
    return await this.tagRepository.find();
  }
}
