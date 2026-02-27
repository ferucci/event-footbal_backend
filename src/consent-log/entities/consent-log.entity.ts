import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from '../../player/entities/player.entity';

@Entity('consent_logs')
export class ConsentLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @Column({ name: 'session_id', length: 255, nullable: true })
  sessionId: string;

  @Column({ name: 'consent_accepted', type: 'boolean', default: false })
  consentAccepted: boolean;

  @Column({ name: 'consent_type', length: 50, default: 'privacy_policy' })
  consentType: string;

  @CreateDateColumn({ name: 'consent_date' })
  consentDate: Date;

  @Column({ name: 'player_id' })
  playerId: number;

  @ManyToOne(() => Player, (player) => player.consents)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @Column({ name: 'site', length: 20 })
  site: string;

  @Column({ name: 'consent_version', length: 20, nullable: true })
  consentVersion: string;

  @Column({ name: 'referrer_url', type: 'text', nullable: true })
  referrerUrl: string;
}