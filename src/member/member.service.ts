import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { AcctService } from 'src/acct/acct.service';
import { Acct } from 'src/acct/entity/acct.entity';
import {
  createQueryBuilder,
  FindManyOptions,
  FindOneOptions,
  getConnection,
  getRepository,
} from 'typeorm';
import { Member } from './entity/member.entity';
import { MemberRepository } from './member.repository';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberRepository)
    private memberRepository: MemberRepository,
    private acctService: AcctService,
  ) {}

  async findByFields(
    options: FindManyOptions<Member>,
  ): Promise<Member | undefined> {
    return await this.memberRepository.findOne(options);
  }

  async findAllByFields(
    options: FindManyOptions<Member>,
  ): Promise<Member[] | undefined> {
    return await this.memberRepository.find(options);
  }

  async save(newMember: Member): Promise<Member | undefined> {
    const memberFind: Member = await this.findByFields({
      where: { name: newMember.name, acct: newMember.acct },
    });
    console.log(memberFind);
    if (memberFind) {
      return undefined;
    }
    return await this.memberRepository.save(newMember);
  }

  async findByName(id: number, name: string): Promise<Member | undefined> {
    // const findAcct = this.acctService.findOne(id);
    // if (!findAcct) {
    //   throw new HttpException('로그인 먼저 해주세요', HttpStatus.BAD_REQUEST);
    // }
    return await this.memberRepository.findOne({
      where: { name: name, acctId: id },
    });
  }
  findAllByAcct(id: number): Promise<Member[]> {
    return this.memberRepository.find({ where: { acctId: id } });
  }

  // async findAllByCam(id: number): Promise<Member[] | undefined> {
  //   return await this.memberRepository.find({ where: { camId: id } });
  // }

  async findAllByCamByAcct(id: number): Promise<Member[] | undefined> {
    const alist = await this.acctService.findAllByFields({
      where: { camId: id },
    });
    let mlist: Member[];
    const allList = [];
    console.log(alist);
    // const find4 = await this.findAllByFields({ where: { acctId: 5 } });
    // console.log(find4);

    for (let i = 0; i < alist.length; i++) {
      mlist = await this.findAllByFields({
        where: { acctId: alist[i].id },
      });
      console.log(mlist);
      allList.push(mlist);
    }
    return allList;
  }
  findOne(id: number): Promise<Member> {
    return this.memberRepository.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.memberRepository.delete(id);
  }
  async update(id: number, member: Member): Promise<void> {
    const existedMember = await this.findOne(id);
    if (existedMember) {
      await getConnection()
        .createQueryBuilder()
        .update(Member)
        .set({
          name: member.name,
        })
        .where('id = :id', { id })
        .execute();
    }
  }
}
