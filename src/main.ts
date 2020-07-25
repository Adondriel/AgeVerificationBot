import { Client, Discord, On, ArgsOf } from '@typeit/discord';
import { AgeVerificationService } from './bot/ageVerification.service';
import { createConnection } from 'typeorm';
import * as Path from 'path';

@Discord('!av ', {
  import: [
    Path.join(__dirname, 'commands', '*.ts'),
    Path.join(__dirname, 'commands', '*.js'),
  ],
})
export class Main {
  constructor() {
    const bot = new Client({
      classes: [`${__dirname}/*Discord.ts`, `${__dirname}/*Discord.js`],
      silent: false,
      variablesChar: ':',
    });

    bot.login(process.env.token);
    this.initConnection();
    console.log('Age Verification Bot is starting...');
  }

  @On('ready')
  async onReady(args, bot) {
    console.log(`Logged in as ${bot.user.tag}`);
    bot.user.setActivity('!av help');
  }

  @On('guildMemberAdd')
  async onGuildMemberAdd([member]: ArgsOf<'guildMemberAdd'>) {
    const avs = new AgeVerificationService(member.guild);
    await avs.init();
    avs.onGuildMemberAdd(member);
  }

  @On('guildCreate')
  async onGuildCreate([guild]: ArgsOf<'guildCreate'>) {
    const avs = new AgeVerificationService(guild);
    await avs.init();
    avs.onGuildCreated();
  }

  @On('guildDelete')
  async onGuildDelete([guild]: ArgsOf<'guildDelete'>) {
    const avs = new AgeVerificationService(guild);
    await avs.init();
    avs.onGuildDeleted();
  }

  private async initConnection() {
    const connection = await createConnection({
      type: 'mongodb',
      url: process.env.db_url,
      w: 'majority',
      ssl: true,
      authSource: 'admin',
      entities: ['dist/**/*.entity.js'],
      useUnifiedTopology: true,
    });

    if (connection) {
      console.info(`Connection to DB established.`);
    }
    return connection;
  }
}
