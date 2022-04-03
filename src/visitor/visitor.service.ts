import { Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { stringify } from 'querystring';
import { Connection, getConnection, getRepository, Like } from 'typeorm';
import { VisitorDTO } from './dto/visitor.dto';
import { Visitor } from './entity/visitor.entity';
import { VisitorRepository } from './visitor.repository';
import { ILike } from 'typeorm';

@Injectable()
export class VisitorService {
  constructor(
    @InjectRepository(VisitorRepository)
    private visitorRepo: VisitorRepository,
  ) {}

  async save(visitor: Visitor): Promise<Visitor | undefined> {
    return await this.visitorRepo.save(visitor);
  }

  async findByDate(date: string, id: number): Promise<Visitor[] | undefined> {
    // const findVisitor = await getRepository(Visitor)
    //   .createQueryBuilder('visitor')
    //   .where('visitor.visitDate like :visitDate and visitor.cam = :id', {
    //     visitDate: visitor.visitDate + '%',
    //     id: id,
    //   })
    //   .getMany();

    // const findVisitor2 = await this.visitorRepo.find({
    //   visitDate: ILike(visitor.visitDate + '%'),
    // });
    // console.log(findVisitor);
    // console.log(findVisitor2);
    console.log(date);
    return await getRepository(Visitor)
      .createQueryBuilder('visitor')
      .where('visitor.visitDate like :visitDate and visitor.cam = :id', {
        visitDate: date + '%',
        id: id,
      })
      .getMany();
  }

  async findAllVisitor(id: number): Promise<Visitor[] | undefined> {
    return await this.visitorRepo.find({ where: { camId: id } });
  }
}
