import { Acct } from 'src/acct/entity/acct.entity';
import { GImgs } from 'src/g-imgs/entity/g-imgs.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('guest')
export class Guest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  acctId: number;

  @ManyToOne(() => Acct, (acct) => acct.guests, { onDelete: 'CASCADE' })
  @JoinColumn()
  acct: Acct;

  @OneToMany(() => GImgs, (gimgs) => gimgs.guest)
  @JoinColumn()
  gImgs: GImgs[];
}
