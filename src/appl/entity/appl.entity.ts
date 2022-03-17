import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('appl')
export class Appl {
  @PrimaryGeneratedColumn()
  id: number;

  // join column으로 변경해야함
  @Column()
  name: string;

  @Column()
  img: string;

  @Column()
  addr: string;
}
