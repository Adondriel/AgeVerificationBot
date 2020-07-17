import { Command, CommandMessage } from '@typeit/discord';
import { MessageEmbed } from 'discord.js';

export abstract class HelpCommand {
    @Command('help')
    async help(cmd: CommandMessage) {
        const helpMsg = new MessageEmbed({
            type: 'rich',
            title: 'Help: Age Verification Bot',
            description: 'all commands start with !av-',
            fields: [{
                name: 'help',
                value: 'Displays this message',
                inline: false,
            }, {
                name: 'nvr',
                value: '**Syntax:** !av-nvr <RoleName>\n This will set which role is used as the "age-not-verified" role. \n(Role name must be unique)',
                inline: false,
            }, {
                name: 'vr',
                value: '**Syntax:** !av-vr <RoleName>\n This will set which role is used as the "age-verified" role. \n(Role name must be unique)',
                inline: true,
            }, {
                name: 'minage',
                value: '**Syntax:** !av-minage <number>\n Anyone that responds under this age will be banned.',
                inline: false,
            }, {
                name: 'maxage',
                value: '**Syntax:** !av-maxage <number>\n Anyone that responds over this age will be banned after 2 attempts.',
                inline: true,
            }],
        });
        cmd.reply(helpMsg);
    }
}
