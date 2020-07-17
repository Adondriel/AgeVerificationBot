import { Command, CommandMessage, Infos } from '@typeit/discord';
import { MessageEmbed } from 'discord.js';
import { GuildConfigService } from '../guild-config/guildConfig.service';

interface MinAgeArgs {
    minAge: number;
}
interface MaxAgeArgs {
    maxAge: number;
}
export abstract class AgeCommands {
    @Command('minage :minAge')
    async minAge(cmd: CommandMessage<MinAgeArgs>) {
        try {
            const sender = cmd.member;
            if (sender.permissions.has('ADMINISTRATOR')) {
                const { minAge } = cmd.args;
                const guildId = cmd.guild.id;
                const guildConfigService = new GuildConfigService();
                if (guildId && minAge && Number.isInteger(minAge) && Number.isSafeInteger(minAge)) {
                    const updateResult = await guildConfigService.updateGuildConfig(guildId, { minAge });
                    cmd.reply(`Successfully updated the minAge option.`);
                } else {
                    cmd.reply(`**Error: Failed to updated the minAge option.**`);
                }
            } else {
                sender.send(`You don't have permissions for that command`);
            }
        } catch (e) {
            console.error('Failed to update minage', e);
            cmd.reply(`Failed to update minage option.`);
        }

    }

    @Command('maxage :maxAge')
    async maxAge(cmd: CommandMessage<MaxAgeArgs>) {
        try {
            const sender = cmd.member;
            if (sender.permissions.has('ADMINISTRATOR')) {
                const { maxAge } = cmd.args;
                const guildId = cmd.guild.id;
                const guildConfigService = new GuildConfigService();
                if (guildId && maxAge && Number.isInteger(maxAge) && Number.isSafeInteger(maxAge)) {
                    const updateResult = await guildConfigService.updateGuildConfig(guildId, { maxAge });
                    cmd.reply(`Successfully updated the maxAge option.`);
                } else {
                    cmd.reply(`**Error: Failed to updated the maxAge option.**`);
                }
            } else {
                sender.send(`You don't have permissions for that command`);
            }
        } catch (e) {
            console.error('Failed to update maxage', e);
            cmd.reply(`Failed to update maxage option.`);
        }
    }
}
