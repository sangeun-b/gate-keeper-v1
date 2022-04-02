import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'member 이름' })
  name: string;

  // @Column()
  // @ApiProperty({ description: 'member 전화번호' })
  // phone: string;

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
