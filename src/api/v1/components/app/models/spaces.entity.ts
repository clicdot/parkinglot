import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('building')
export class SpacesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  building: string;

  @Column()
  active: boolean;

  @Column({ default: {} })
  spaces: string;

  @Column()
  spaces_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  order: number;
}
