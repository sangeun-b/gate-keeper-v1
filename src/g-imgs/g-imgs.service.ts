import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GImgsRepository } from './g-imgs.repository';
import { GImgs } from './entity/g-imgs.entity';
import { Guest } from 'src/guest/entity/guest.entity';
import { getConnection } from 'typeorm';

@Injectable()
export class GImgsService {
  constructor(
    @InjectRepository(GImgsRepository)
    private gImgsRepository: GImgsRepository,
  ) {}
  findAll(id: number): Promise<GImgs[] | undefined> {
    return this.gImgsRepository.find({ where: { guestId: id } });
  }
  async save(img: GImgs, guest: Guest): Promise<GImgs | undefined> {
    img.guest = guest;
    return await this.gImgsRepository.save(img);
  }

  async findOne(id: number): Promise<GImgs | undefined> {
    return await this.gImgsRepository.findOne(id);
  }

  async findByName(name: string): Promise<GImgs | undefined> {
    return await this.gImgsRepository.findOne({ where: { name: name } });
  }

  async findByPath(path: string): Promise<GImgs | undefined> {
    return await this.gImgsRepository.findOne({ where: { url: path } });
  }
  async remove(id: number): Promise<void> {
    await this.gImgsRepository.delete(id);
  }
  async update(id: number, filename: string): Promise<void> {
    console.log(filename);
    const existedGImgs = await this.gImgsRepository.findOne(id);
    await getConnection()
      .createQueryBuilder()
      .update(GImgs)
      .set({
        url: filename,
      })
      .where('id=:id', { id })
      .execute();
  }
}
