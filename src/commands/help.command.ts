import { Command, CommandMessage } from '@typeit/discord';
import { MessageEmbed } from 'discord.js';

export abstract class HelpCommand {
    @Command('help')
    async help(cmd: CommandMessage) {
        const helpMsg = new MessageEmbed({
            type: 'rich',
            title: 'Help: Age Verification Bot',
            description: 'All commands require administrator permission. \n Min & Max age are not displayed to the user.',
            fields: [{
                name: '!av help',
                value: 'Displays this message.',
                inline: false,
            }, {
                name: '!av nvr <Role Name>',
                value: 'This will set which role is used as the "age-not-verified" role. \n(Role name must be unique)',
                inline: false,
            }, {
                name: '!av vr <Role Name>',
                value: 'This will set which role is used as the "age-verified" role. \n(Role name must be unique)',
                inline: false,
            }, {
                name: '!av minage <number>',
                value: 'Sets the minimum age for a user on your server.\nAnyone that responds under this age will be banned.',
                inline: false,
            }, {
                name: '!av maxage <number>',
                value: 'Sets the maximum age for a user on your server.\nAnyone that responds over this age will be banned after 2 attempts.',
                inline: false,
            }],
        });
        cmd.reply(helpMsg);
    }
}
