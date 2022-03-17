import { Acct } from 'src/acct/entity/acct.entity';
import { Imgs2 } from 'src/Imgs2/entity/imgs2.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('member')
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  // @Column()
  // addr: string;

  @Column({ nullable: true })
  acctId: number;

  @ManyToOne(() => Acct, (acct) => acct.members, { onDelete: 'CASCADE' })
  @JoinColumn()
  acct: Acct;

  @OneToMany(() => Imgs2, (imgs) => imgs.member)
  @JoinColumn()
  imgs: Imgs2[];
}
