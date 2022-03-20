import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unlinkSync } from 'fs';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { Member } from 'src/member/entity/member.entity';
import { MemberService } from 'src/member/member.service';
import { getConnection } from 'typeorm';
import { Imgs2 } from './entity/imgs2.entity';
import { ImgsRepository } from './imgs2.repository';

@Injectable()
export class ImgsService {
  constructor(
    @InjectRepository(ImgsRepository)
    private imgsRepository: ImgsRepository,
  ) {}
  findAll(id: number): Promise<Imgs2[] | undefined> {
    return this.imgsRepository.find({ where: { memberId: id } });
  }
  async save(img: Imgs2, mem: Member): Promise<Imgs2 | undefined> {
    img.member = mem;
    return await this.imgsRepository.save(img);
  }

  async findOne(id: number): Promise<Imgs2 | undefined> {
    return await this.imgsRepository.findOne(id);
  }

  async findByName(name: string): Promise<Imgs2 | undefined> {
    return await this.imgsRepository.findOne({ where: { name: name } });
  }

  async findByPath(path: string): Promise<Imgs2 | undefined> {
    return await this.imgsRepository.findOne({ where: { url: path } });
  }
  async remove(id: number): Promise<void> {
    await this.imgsRepository.delete(id);
  }
  async update(id: number, filename: string): Promise<void> {
    console.log(filename);
    const existedImgs2 = await this.imgsRepository.findOne(id);
    await getConnection()
      .createQueryBuilder()
      .update(Imgs2)
      .set({
        url: filename,
      })
      .where('id=:id', { id })
      .execute();
  }
}
