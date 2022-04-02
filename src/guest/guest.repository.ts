import { EntityRepository, Repository } from 'typeorm';
import { Guest } from './entity/guest.entity';

@EntityRepository(Guest)
export class GuestRepository extends Repository<Guest> {}
