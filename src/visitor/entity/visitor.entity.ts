import { ApiProperty } from '@nestjs/swagger';
import { Cam } from 'src/cam/entity/cam.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('visitor')
export class Visitor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  img: string;

  @CreateDateColumn()
  visitDate: Date;

  @Column({ nullable: true })
  camId: number;

  @ManyToOne(() => Cam, (cam) => cam.visitors)
  @JoinColumn()
  cam: Cam;
}
