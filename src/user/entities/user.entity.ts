import{Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { UserRole } from '../enum/user.role.enum';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    UserName:string;

    @Column()
    email:string;

    @Column()
    password:string;

    @Column({
        type:'enum',
        enum:UserRole,
        default:UserRole.USER
    })
    role:UserRole;

    @OneToMany(() => Post, (post) => post.user)
    posts:Post[]; // OneToMany relationship with Post entity

}
