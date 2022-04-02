import { Acct } from 'src/acct/entity/acct.entity';
import { Imgs2 } from 'src/Imgs2/entity/imgs2.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('guest')
export class Guest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column()
  img: string;

  @Column({ nullable: true })
  acctId: number;

  @ManyToOne(() => Acct, (acct) => acct.guests, { onDelete: 'CASCADE' })
  @JoinColumn()
  acct: Acct;
}
