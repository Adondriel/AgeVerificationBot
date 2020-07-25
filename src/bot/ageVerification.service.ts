import * as Discord from 'discord.js';
import { GuildConfigService } from '../guild-config/guildConfig.service';
import { GuildMember } from '../typedefs';
import { GuildConfig } from '../guild-config/guildConfig.entity';
/**
 * Responsible for verifying age of users.
 */
export class AgeVerificationService {
    // instanciate the guild config DB service.
    private guildConfigService: GuildConfigService;
    private guildConfig: GuildConfig;
    // message definitions
    private under13 = new Discord.MessageEmbed().setColor('RED')
        .setDescription('**BANNED, because Discord doesn\'t allow users under 13. https://discord.com/terms**');
    private over100 = new Discord.MessageEmbed().setColor('ORANGE')
        .setDescription('Haha very funny, **one remaining try**');
    private over100Banned = new Discord.MessageEmbed().setColor('ORANGE')
        .setDescription('Haha very funny, **BANNED**');
    private verifiedMsg = new Discord.MessageEmbed().setColor('GREEN')
        .setDescription('**You\'ve been verified.**');

    constructor(private guild: Discord.Guild) { }
    /**
     * inits the guild config for this instance of the AVS.
     */
    async init(): Promise<AgeVerificationService> {
        this.guildConfigService = new GuildConfigService();
        this.guildConfig = await this.guildConfigService.getGuildConfig(this.guild.id);
        return this;
    }

    /**
     * Called when the bot is removed from a server.
     */
    onGuildDeleted() {
        this.guildConfigService.deleteGuildConfig(this.guild.id);
    }

    /**
     * Called when the bot is added to a server.
     */
    onGuildCreated() {
        try {
            this.setupRolesAndConfig();
        } catch (error) {
            console.error('Error on bot joined', error);
        }
    }

    /**
     * Called when a new guild member is added to a server(guild).
     * @param member the member that was added.
     */
    onGuildMemberAdd(member: GuildMember) {
        this.memberNotVerified(member);
        this.verifyAge(member, 0);
    }

    /**
     * handles logic for sending & checking the response from guild member.
     * @param member the guild member to verify
     * @param tryCount the number of times this function has been called for this member.
     */
    private async verifyAge(member: GuildMember, tryCount: number) {
        try {
            const minAge = this.guildConfig.minAge;
            const maxAge = this.guildConfig.maxAge;
            const response = await this.getVerifyResponse(member, tryCount);
            if (response < minAge) {
                this.banMember(member, this.under13);
            } else if (response < maxAge) {
                await member.send(this.verifiedMsg);
                this.memberVerified(member);
            } else if (tryCount < 1) {
                await member.send(this.over100);
                this.verifyAge(member, tryCount + 1);
            } else {
                this.banMember(member, this.over100Banned);
            }
        } catch (error) {
            console.error('error in verifyage:', error);
        }
    }

    /**
     * Sends a prompt and collects the response message from the user.
     * @param member The discord user/guild member
     * @param tryCount how many times they have attempted a response.
     * (they get 1 retry if they answer too high, but no retries if they answer too low)
     * @returns number, 999 if it's an invalid response.
     */
    private async getVerifyResponse(member: GuildMember, tryCount: number): Promise<number> {
        try {
            const verify = new Discord.MessageEmbed()
                .setColor('ORANGE')
                .setDescription('The server you joined requires that you verify your age. Please reply with your age');
            if (tryCount < 1) {
                verify.setFooter('Reply within 1 hour');
            } else {
                verify.setFooter('Last Attempt');
            }
            // initial embed that gets send to user DM
            const message = await member.send(verify);
            // @ts-ignore
            const collector = new Discord.MessageCollector(message.channel, r => r, {
                // 1 hr
                time: 3600000,
                // 10 seconds
                // time: 10000,
                max: 1,
            });
            // collector.addListener('end', this.collectorEnded.bind(this, member));
            // collect messages from DM channel, uses channel ID from above, awaiting up to 1 messages in the DM channel.
            let response: Discord.Message;
            let value: number;
            try {
                // collector.next is a promise that is rejected if they do not respond before the collector ends.
                response = await collector.next;
                // parse response into int
                value = Number.parseInt(response.cleanContent, 10);
                // if it is not an int, value is 999.
                value = (Number.isInteger(value)) ? value : 999;
            } catch (e) {
                // user failed to respond in time, value should be 999, to give them 1 attempt to reply.
                value = 999;
            }
            // if value is nullish(undefined/null), return 999;
            return value;
        } catch (error) {
            console.error('error in getVerifyResponse', error);
            throw error;
        }
    }

    /**
     * Adds the not verified role to the guild member.
     * @param member the member that should be modified.
     */
    private async memberNotVerified(member: GuildMember) {
        try {
            return await member.roles.add(this.getNotVerifiedRole());
        } catch (e) {
            console.error('Error in give not verified role', e);
        }
    }

    /**
     * Removes unverified role & adds verified role to/from the member.
     * @param member the member that should be verified.
     */
    private async memberVerified(member: GuildMember) {
        try {
            await member.roles.remove(this.getNotVerifiedRole());
            return await member.roles.add(this.getVerifiedRole());
        } catch (e) {
            console.error('Error in remove not verified role', e);
        }
    }

    /**
     * Gets age-not-verified role if it exists, if not creates the role and returns it.
     */
    private getNotVerifiedRole(): Discord.Role {
        try {
            return this.guild.roles.cache.find(r => r.id === this.guildConfig.notVerifiedRoleId);
        } catch (error) {
            console.error('error in getNotVerifiedRole', error);
            throw error;
        }
    }

    /**
     * Gets age-not-verified role if it exists, if not creates the role and returns it.
     */
    private getVerifiedRole(): Discord.Role {
        try {
            return this.guild.roles.cache.find(r => r.id === this.guildConfig.verifiedRoleId);
        } catch (error) {
            console.error('error in getNotVerifiedRole', error);
            throw error;
        }
    }

    private async setupRolesAndConfig() {
        const notVerifiedRole = await this.guild.roles.create({
            data: {
                name: 'age-not-verified',
                color: '#2f3136',
                position: 1,
            },
        });
        const verifiedRole = await this.guild.roles.create({
            data: {
                name: 'age-verified',
                position: 2,
            },
        });

        this.guildConfigService.saveGuildConfig({
            guildId: this.guild.id,
            notVerifiedRoleId: notVerifiedRole.id,
            verifiedRoleId: verifiedRole.id,
            minAge: 13,
            maxAge: 100,
            banCount: 0,
        });
    }

    private async banMember(member: GuildMember, msg: Discord.MessageEmbed) {
        try {
            await member.send(msg);
            await member.ban();
            this.guildConfigService.updateBanCount(this.guild.id, this.guildConfig.banCount + 1);
        } catch (e) {
            console.error('Error banning member, ', e);
        }
    }
}
