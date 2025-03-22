import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { USER_ROLE } from '../../../types';
import { StoreEntity } from '../../store/entities/store.entity';

@Entity({
  database: process.env.DB_DATABASE,
  name: 'user',
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({
    default: false,
  })
  isActive!: boolean;

  @Column({
    default: '',
  })
  activationCode!: string;

  @Column({
    type: 'enum',
    enum: USER_ROLE,
    enumName: 'user_role',
  })
  role!: USER_ROLE;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  permissions!: string[];


  @OneToOne(() => StoreEntity, (store) => store.user_profile, {
    eager: true,
  })
  @JoinColumn()
  store!: StoreEntity;
}
