import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, getConnection } from 'typeorm';
import { AcctRepository } from './acct.repository';
import { AcctDTO } from './dto/acct.dto';
import * as bcrypt from 'bcrypt';
import { Acct } from './entity/acct.entity';

@Injectable()
export class AcctService {
  constructor(
    @InjectRepository(AcctRepository)
    private acctRepository: AcctRepository,
  ) {}

  async findByFields(options: FindOneOptions<Acct>): Promise<Acct | undefined> {
    return await this.acctRepository.findOne(options);
  }

  async findAllByFields(
    options: FindOneOptions<Acct>,
  ): Promise<Acct[] | undefined> {
    return await this.acctRepository.find(options);
  }

  findOneById(id: string): Promise<Acct> {
    return this.acctRepository.findOne({ where: { acct_id: id } });
  }

  async save(acct: Acct): Promise<Acct | undefined> {
    await this.transformPassword(acct);
    console.log(acct);
    return await this.acctRepository.save(acct);
  }

  async transformPassword(acct: Acct): Promise<void> {
    acct.pwd = await bcrypt.hash(acct.pwd, 10);
    return Promise.resolve();
  }
  findAll(): Promise<Acct[]> {
    return this.acctRepository.find();
  }

  findOne(id: number): Promise<Acct> {
    return this.acctRepository.findOne(id);
  }

  // async create(acct: Acct): Promise<void> {
  //   await this.acctRepository.save(acct); //async: 처리가 완료된 다음에 return
  // }

  async remove(email: string): Promise<void> {
    const acct = await this.findOneById(email);
    const id = acct.id;
    await this.acctRepository.delete(id);
  }

  async update(id: number, acct: Acct): Promise<void> {
    const existedAcct = await this.findOne(id);
    if (existedAcct) {
      await getConnection()
        .createQueryBuilder()
        .update(Acct)
        .set({
          phone: acct.phone,
        })
        .where('id = :id', { id })
        .execute();
    }
  }
}
