import { EntityRepository, Repository } from 'typeorm';
import { Imgs2 } from './entity/imgs2.entity';

@EntityRepository(Imgs2)
export class ImgsRepository extends Repository<Imgs2> {
  constructor() {
    super();
    console.log('------');
  }
}
