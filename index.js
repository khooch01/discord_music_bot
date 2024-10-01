const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const sodium = require('libsodium-wrappers');

(async () => {
    await sodium.ready;

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildVoiceStates,
        ],
    });

    client.config = {
        colorDefault: 0x0099ff,
        colorError: 0x7289D,
        spotifyApi: {
            enabled: true,
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        },
    };


    client.distube = new DisTube(client, {
        emitNewSongOnly: true,
        emitAddSongWhenCreatingQueue: true,
        plugins: [new SpotifyPlugin(), new SoundCloudPlugin()],
        ffmpeg: {
            executable: 'C:\\ffmpeg\\bin\\ffmpeg.exe', // If ffmpeg is not in your PATH, use the full path
        },
    });


    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });


    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        if (message.content.startsWith('!play ')) {
            const args = message.content.split(' ');
            const query = args.slice(1).join(' ');

            if (!query) {
                return message.channel.send('Please provide a song name or URL to play!');
            }

            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel) {
                return message.reply('You need to be in a voice channel to play music!');
            }

            try {
                await client.distube.play(voiceChannel, query, {
                    textChannel: message.channel,
                    member: message.member,
                });
            } catch (error) {
                console.error('Error playing music:', error);
                message.reply('There was an error trying to play the requested song.');
            }
            return; // Prevent fall-through to other commands
        }

        if (message.content.startsWith('!stop')) {
            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel) {
                return message.reply('You need to be in a voice channel to stop music!');
            }
            const queue = client.distube.getQueue(message);
            if (!queue) {
                return message.channel.send('There is no music playing!');
            }
            client.distube.stop(message);
            message.channel.send('Music has been stopped.');
            return;
        }

        if (message.content.startsWith('!pause')) {
            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel) {
                return message.reply('You need to be in a voice channel to pause music!');
            }
            const queue = client.distube.getQueue(message);
            if (!queue || !queue.playing) {
                return message.channel.send('There is no music playing to pause!');
            }
            client.distube.pause(message);
            message.channel.send('Music has been paused.');
            return;
        }

        if (message.content.startsWith('!resume')) {
            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel) {
                return message.reply('You need to be in a voice channel to resume music!');
            }
            const queue = client.distube.getQueue(message);
            if (!queue || !queue.paused) {
                return message.channel.send('There is no paused song to resume!');
            }
            client.distube.resume(message);
            message.channel.send('Resumed the music!');
            return;
        }

        if (message.content.startsWith('!skip')) {
            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel) {
                return message.reply('You need to be in a voice channel to skip music!');
            }
            client.distube.skip(message);
            message.channel.send('Skipped the current song.');
            return;
        }

        if (message.content.startsWith('!queue')) {
            const queue = client.distube.getQueue(message);
            if (!queue) {
                return message.channel.send('There is nothing in the queue!');
            }
            message.channel.send(`Current queue: \n${queue.songs.map((song, index) => `${index + 1}. ${song.name}`).join('\n')}`);
            return;
        }
    });

    client.distube.on('addSong', async (queue, song) => {
        const msg = await queue.textChannel.send({
            embeds: [{
                color: client.config.colorDefault,
                title: 'Added to queue',
                description: `**[${song.name}](${song.url})**`,
                fields: [
                    { name: 'Duration', value: song.formattedDuration, inline: true },
                    { name: 'Requested by', value: `${song.user}`, inline: true },
                ],
                footer: { text: `${queue.songs.length} songs in queue` },
            }],
        });

        setTimeout(() => {
            msg.delete();
        }, 20000);
    });

    client.distube.on('playSong', async (queue, song) => {
        const msg = await queue.textChannel.send({
            embeds: [{
                color: client.config.colorDefault,
                title: 'Now playing',
                description: `**[${song.name}](${song.url})**`,
                fields: [
                    { name: 'Duration', value: song.formattedDuration, inline: true },
                    { name: 'Requested by', value: `${song.user}`, inline: true },
                ],
                footer: { text: `${queue.songs.length} songs in queue` },
            }],
        });

        setTimeout(() => {
            msg.delete();
        }, 60000);
    });

    client.distube.on('error', async (channel, error) => {
        if (channel && channel.send) {
            const msg = await channel.send({
                embeds: [{
                    color: client.config.colorError,
                    description: `An error has occurred: ${error.message}`,
                }],
            });

            setTimeout(() => {
                msg.delete();
            }, 20000);
        } else {
            console.error("Error channel is not valid:", channel);
        }
    });

    client.distube.on('empty', async (queue) => {
        const msg = await queue.textChannel.send({
            embeds: [{
                color: client.config.colorError,
                description: 'The voice channel is empty! Leaving the channel.',
            }],
        });

        setTimeout(() => {
            msg.delete();
        }, 20000);
    });

    client.login(process.env.DISCORD_TOKEN);
})();
