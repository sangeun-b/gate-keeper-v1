import { EntityRepository, Repository } from 'typeorm';
import { Visitor } from './entity/visitor.entity';

@EntityRepository(Visitor)
export class VisitorRepository extends Repository<Visitor> {}
