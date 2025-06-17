import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    title: string;

    @Column({
        nullable: false
    })
    content: string;


    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    //     @OneToMany(() => Comment, comment => comment.post)
    // comments: Comment[];

    @Column({ name: 'author_id', nullable: false })
    authorId: string;

    @ManyToOne(() => User, (user) => user.posts,)
    @JoinColumn({ name: 'author_id' })
    user: User

}
