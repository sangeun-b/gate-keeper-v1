import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AcctService } from 'src/acct/acct.service';
import { Guest } from './entity/guest.entity';
import { GuestRepository } from './guest.repository';

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(GuestRepository)
    private guestRepository: GuestRepository,
  ) {}

  async save(newGuest: Guest): Promise<Guest | undefined> {
    const guestFind: Guest = await this.guestRepository.findOne({
      where: { name: newGuest.name, acct: newGuest.acct },
    });
    if (guestFind) {
      return undefined;
    }
    return await this.guestRepository.save(newGuest);
  }
  findAllByAcct(id: number): Promise<Guest[]> {
    return this.guestRepository.find({ where: { acctId: id } });
  }

  async remove(id: number): Promise<void> {
    await this.guestRepository.delete(id);
  }

  findOne(id: number): Promise<Guest> {
    return this.guestRepository.findOne(id);
  }
}
