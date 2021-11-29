import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Entity decorator tells TypeORM to create a table from a class
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;
}
