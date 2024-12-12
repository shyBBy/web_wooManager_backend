import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  database: process.env.DB_DATABASE,
  name: 'order',
})
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    default: '',
  })
  tracking_number: string;

  @Column({
    default: '',
  })
  order_id: string;

  @Column({
    default: false,
    type: Boolean,
  })
  notification_was_send: boolean;

  @Column({
    default: '',
  })
  state_description: string; //STATUS PACZKI
}
