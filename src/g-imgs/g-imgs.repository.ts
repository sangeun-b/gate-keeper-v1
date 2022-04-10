import { EntityRepository, Repository } from 'typeorm';
import { GImgs } from './entity/g-imgs.entity';

@EntityRepository(GImgs)
export class GImgsRepository extends Repository<GImgs> {
  constructor() {
    super();
    console.log('------');
  }
}
