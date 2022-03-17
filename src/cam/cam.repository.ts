import { EntityRepository, Repository } from 'typeorm';
import { Cam } from './entity/cam.entity';

@EntityRepository(Cam)
export class CamRepository extends Repository<Cam> {}
