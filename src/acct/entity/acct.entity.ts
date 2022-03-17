import { Cam } from 'src/cam/entity/cam.entity';
import { Member } from 'src/member/entity/member.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('acct')
export class Acct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  acct_id: string;

  @Column()
  pwd: string;

  @Column()
  phone: string;

  @Column()
  addr: string;

  @Column({ nullable: true })
  camId: number;

  @ManyToOne(() => Cam, (cam) => cam.acct, { onDelete: 'CASCADE' })
  @JoinColumn()
  cam: Cam;

  @OneToMany(() => Member, (member) => member.acct)
  @JoinColumn()
  members: Member[];
}
