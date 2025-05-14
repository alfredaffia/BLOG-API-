import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({
        nullable:false
    })
    text:string;

    @ManyToOne(()=> User, (user) => user.posts, )
    user:User
}
