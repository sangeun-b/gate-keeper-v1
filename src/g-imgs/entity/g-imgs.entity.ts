import { ApiProperty } from '@nestjs/swagger';
import { Guest } from 'src/guest/entity/guest.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('gimgs')
export class GImgs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @CreateDateColumn()
  uploadDate: Date;

  @Column({ nullable: true })
  guestId: number;

  @ManyToOne(() => Guest, (guest) => guest.gImgs, { onDelete: 'CASCADE' })
  @JoinColumn()
  guest: Guest;
}
