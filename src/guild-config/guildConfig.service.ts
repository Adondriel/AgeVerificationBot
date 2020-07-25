import { GuildConfig } from './guildConfig.entity';
import { Repository, ObjectID, getRepository, DeleteResult } from 'typeorm';

export class GuildConfigService {
    private guildConfigRepository: Repository<GuildConfig>;
    constructor() {
        this.guildConfigRepository = getRepository(GuildConfig);
    }
    async saveGuildConfig(guildConfig: GuildConfig): Promise<GuildConfig> {
        return await this.guildConfigRepository.save(guildConfig);
    }

    async getGuildConfig(guildId: string): Promise<GuildConfig> {
        return await this.guildConfigRepository.findOne({ guildId });
    }

    async getProperty(guildId: string, property: string): Promise<number> {
        const guildConfig = await this.getGuildConfig(guildId);
        return guildConfig[property];
    }

    async updateGuildConfig(guildId: string, values: any) {
        return await this.guildConfigRepository.update({ guildId }, values);
    }

    async updateBanCount(guildId: string, banCount: number) {
        return await this.guildConfigRepository.update({ guildId }, { banCount });
    }

    async deleteGuildConfig(guildId: string): Promise<DeleteResult> {
        return await this.guildConfigRepository.delete({ guildId });
    }
}
