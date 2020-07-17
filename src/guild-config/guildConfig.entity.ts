// tslint:disable: variable-name
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class GuildConfig {
    @ObjectIdColumn()
    _id?: ObjectID;
    @Column()
    guildId: string;
    @Column()
    notVerifiedRoleId: string;
    @Column()
    verifiedRoleId: string;
    @Column({ default: 13 })
    minAge?: number;
    @Column({ default: 100 })
    maxAge?: number;
    @Column({ default: 0 })
    banCount?: number;
}
