import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 10 })
  number: string;

  @Column({ name: 'height', length: 20, nullable: true })
  height?: string;

  @Column({ name: 'weight', length: 20, nullable: true })
  weight?: string;

  @Column({ length: 50 })
  position: string;

  @Column({ type: 'integer', nullable: true })
  rate: number | null;

  @Column({ name: 'country_flag_url', length: 255 })
  country: string;

  @Column({ name: 'player_image_url', length: 255 })
  image: string;

  @Column({ length: 20 })
  site: string

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at'
  })
  createdAt: Date;

  @Column('int')
  countClicks?: number = 0;

}