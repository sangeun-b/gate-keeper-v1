import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { CamRepository } from './cam.repository';
import { Cam } from './entity/cam.entity';

@Injectable()
export class CamService {
  constructor(
    @InjectRepository(CamRepository)
    private camRepository: CamRepository,
  ) {}

  async create(cam: Cam): Promise<Cam | undefined> {
    return await this.camRepository.save(cam);
  }
  findAll(): Promise<Cam[] | undefined> {
    return this.camRepository.find();
  }
  findOne(id: number): Promise<Cam | undefined> {
    return this.camRepository.findOne(id);
  }

  async findByMacAddr(macAddr: string): Promise<Cam | undefined> {
    // const findCam = await this.camRepository.findOne({
    //   where: { macAddr: cam.macAddr },
    // });
    // console.log(findCam);
    return this.camRepository.findOne({ where: { macAddr: macAddr } });
  }

  async findByAddr(cam: Cam): Promise<Cam | undefined> {
    // const findCam = await this.camRepository.findOne({
    //   where: { macAddr: cam.macAddr },
    // });
    // console.log(findCam);
    return this.camRepository.findOne({ where: { addr: cam.addr } });
  }

  async remove(id: number): Promise<void> {
    await this.camRepository.delete(id);
  }

  async update(id: number, cam: Cam): Promise<void> {
    const existedCam = this.camRepository.findOne(id);
    if (existedCam) {
      await getConnection()
        .createQueryBuilder()
        .update(Cam)
        .set({
          macAddr: cam.macAddr,
        })
        .where('id = :id', { id })
        .execute();
    }
  }
}
