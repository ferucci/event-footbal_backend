import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ConsentLog } from '../../consent-log/entities/consent-log.entity';

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

  @Column({ type: 'integer', nullable: true, default: null })
  rate: number | null;

  @Column({ name: 'country_flag_url', length: 255 })
  country: string;

  @Column({ name: 'player_image_url', length: 255 })
  image: string;

  @Column({ length: 20 })
  site: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at'
  })
  createdAt: Date;

  @Column({ type: 'int', default: 0 })
  countClicks: number;

  @OneToMany(() => ConsentLog, (consent) => consent.player)
  consents: ConsentLog[];
}