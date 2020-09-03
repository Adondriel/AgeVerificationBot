## Description
The goal of this discord bot is to "verify" the age of any user who joins your discord server.

Ensure your server is following the Discord TOS by verifing the age of new server members, and banning those that would violate it.

When a new member joins your discord, this bot will ask them to verify their age, and will give them 1 hour to do so.
If they are under 13, they will be automatically banned by the bot & informed why they were banned.
If they respond over 100 they have 1 chance to answer truthfully or they are also banned for lying about their age.

When the bot is first added it will create an "unverified" and "verified" role.
When the user joins, they are given the "unverified" role, and asked to verify their age, in a DM.
Once their age is verified, the bot should update the user's role with the "verified" role.

All ages & ranks that the bot uses can be configured using the bot commands.
use `!avb help` for more info.

![verified example](https://i.imgur.com/vYeuged.png)
![banned example](https://i.imgur.com/j1C36kU.png)

### Features:
  - DM based interactions (no clutter or private info being sent to public channels)
  - Command based configs (allows server owner to configure the bot, using commands)
  - Ban & Role management


### Tech Stack:
  - [Nest.js](https://nestjs.com/), an angular-like node.js framework. If needed, this can be used to run both the bot & a bot website in the same process.
  - [TypeORM](https://typeorm.io/#/) and ORM that is actually meant to be used in TS projects, with support for mongoDB!
  - [MongoDB](https://www.mongodb.com/cloud/atlas) via MongoDB Atlas (free)
  - [Discord.ts](https://github.com/OwenCalvin/discord.ts) A proper discord.js framework, but using Typescript & decorators!

## Other Info
  - Heroku ready, just link heroku to a fork of this repo, setup token & DB connection info.
  - In theory, this repo could be modified to "easily" create a single repo that hosts both the bot & a bot website on a single server instance.
  - The "bot" folder is specific to this bot, and you could easily remove it, and implement your bot within the commands alone. It is only needed because of this bot's behavior (time based confirmation requires a stateful architecture in this case, in that, each user being verified needs to have it's own instance of the bot logic, so that it doesn't lose track of where the user came from, etc)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test
Testing of this bot requires you to have an alt account.
Message @Adondriel on discord to get an invite link to the test server, to see how it works.

## Support
I am active in the [Discord.ts](https://github.com/OwenCalvin/discord.ts) discord server. (how meta can we get?)

Our support discord: https://discord.gg/j6PcGGB

## Stay in touch
- Author - [Adam Pine](https://adampine.me)
