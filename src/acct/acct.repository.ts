import { EntityRepository, Repository } from 'typeorm';
import { Acct } from './entity/acct.entity';

@EntityRepository(Acct)
export class AcctRepository extends Repository<Acct> {}
