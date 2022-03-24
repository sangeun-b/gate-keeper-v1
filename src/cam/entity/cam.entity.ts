import { ApiProperty } from '@nestjs/swagger';
import { Acct } from 'src/acct/entity/acct.entity';
import { Visitor } from 'src/visitor/entity/visitor.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cam')
export class Cam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({ description: 'mac address' })
  macAddr: string;

  @Column()
  @ApiProperty({ description: '주소' })
  addr: string;

  @OneToMany(() => Acct, (acct) => acct.camId)
  @JoinColumn()
  acct: Acct[];

  @OneToMany(() => Visitor, (visitor) => visitor.cam)
  @JoinColumn()
  visitors: Visitor[];
}
