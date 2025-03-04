import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({unique:true})
  phone: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ default: false })
  isLocked: boolean ;

  @Column({ nullable: true ,type: 'varchar', length: 255  })
  lockedBy: string |null ;
}