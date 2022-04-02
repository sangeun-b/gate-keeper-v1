import { ApiProperty } from '@nestjs/swagger';
import { Cam } from 'src/cam/entity/cam.entity';
import { Guest } from 'src/guest/entity/guest.entity';
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
  @ApiProperty({ description: 'acct id' })
  acct_id: string;

  @Column()
  @ApiProperty({ description: 'acct password' })
  pwd: string;

  @Column()
  @ApiProperty({ description: '전화번호' })
  phone: string;

  @Column()
  @ApiProperty({
    description: '주소',
  })
  addr: string;

  @Column({ nullable: true })
  camId: number;

  @ManyToOne(() => Cam, (cam) => cam.acct, { onDelete: 'CASCADE' })
  @JoinColumn()
  cam: Cam;

  @OneToMany(() => Member, (member) => member.acct)
  @JoinColumn()
  members: Member[];

  @OneToMany(() => Guest, (guest) => guest.acct)
  @JoinColumn()
  guests: Guest[];
}
