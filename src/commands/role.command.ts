import { Command, CommandMessage } from '@typeit/discord';
import { GuildConfigService } from '../guild-config/guildConfig.service';

interface NvrArgs {
    roleName: string;
}
export abstract class RoleCommands {
    @Command('nvr :roleName')
    async nvr(cmd: CommandMessage<NvrArgs>) {
        const sender = cmd.member;
        if (sender.permissions.has('ADMINISTRATOR')) {
            const { roleName } = cmd.args;
            const guild = cmd.guild;
            const allMatchingRoles = guild.roles.cache.filter(r => r.name.toLocaleLowerCase() === roleName.toLocaleLowerCase());
            const numberOfMatchingRoles = (allMatchingRoles) ? allMatchingRoles.size : 0;
            if (numberOfMatchingRoles === 1) {
                const role = allMatchingRoles.first();
                const notVerifiedRoleId = (role) ? role.id : undefined;
                const guildConfigService = new GuildConfigService();
                if (guild.id && notVerifiedRoleId) {
                    await guildConfigService.updateGuildConfig(guild.id, { notVerifiedRoleId });
                    cmd.reply(`Successfully changed the age-not-verified role.`);
                }
            } else {
                cmd.reply(`Error: There are ${numberOfMatchingRoles} matching that role name. There must be exactly 1.`);
            }
        } else {
            sender.send(`You don't have permissions for that command`);
        }
    }

    @Command('vr :roleName')
    async vr(cmd: CommandMessage<NvrArgs>) {
        const sender = cmd.member;
        if (sender.permissions.has('ADMINISTRATOR')) {
            const { roleName } = cmd.args;
            const guild = cmd.guild;
            const allMatchingRoles = guild.roles.cache.filter(r => r.name.toLocaleLowerCase() === roleName.toLocaleLowerCase());
            const numberOfMatchingRoles = (allMatchingRoles) ? allMatchingRoles.size : 0;
            if (numberOfMatchingRoles === 1) {
                const role = allMatchingRoles.first();
                const verifiedRoleId = (role) ? role.id : undefined;
                const guildConfigService = new GuildConfigService();
                if (guild.id && verifiedRoleId) {
                    await guildConfigService.updateGuildConfig(guild.id, { verifiedRoleId });
                    cmd.reply(`Successfully changed the age-verified role.`);
                }
            } else {
                cmd.reply(`Error: There are ${numberOfMatchingRoles} matching that role name. There must be exactly 1.`);
            }
        } else {
            sender.send(`You don't have permissions for that command, you must be an administrator.`);
        }
    }

}
