import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class IP {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  ip: string;

  @Column({ type: 'varchar' })
  metadata: string;
}
