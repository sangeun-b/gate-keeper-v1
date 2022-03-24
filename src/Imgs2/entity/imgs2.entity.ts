import { ApiProperty } from '@nestjs/swagger';
import { Member } from 'src/member/entity/member.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('imgs')
export class Imgs2 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @CreateDateColumn()
  uploadDate: Date;

  @Column({ nullable: true })
  memberId: number;

  @ManyToOne(() => Member, (member) => member.imgs, { onDelete: 'CASCADE' })
  @JoinColumn()
  member: Member;
}
