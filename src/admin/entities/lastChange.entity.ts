import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  database: process.env.DB_DATABASE,
  name: 'lastchange',
})
export class LastChangeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: '',
  })
  title: string;

  @Column({
    default: '',
  })
  description: string;

  @Column({
    default: '',
  })
  addedByUser: string;

  @Column()
  addedDate: string;
}
