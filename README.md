# Discord Music Bot 🎶

A feature-rich Discord bot that can play music from various sources, including Spotify and SoundCloud. This bot utilizes `distube`, a music handler for Discord.js, to provide seamless music playback in Discord voice channels.

## Features

- 🎵 Play music from Spotify, SoundCloud, and YouTube.
- ⏸️ Pause, resume, skip, and stop music playback.
- 📜 View the current queue of songs.
- 🔊 Simple, easy-to-use commands for users.

## Getting Started

These instructions will help you set up and deploy the Discord Music Bot on your local machine or a server.

### Prerequisites

- Node.js (v16 or later)
- npm (Node Package Manager)
- A Discord bot token (see [Discord Developer Portal](https://discord.com/developers/applications))
- FFMPEG (to process audio)

### Installation

1. **Clone the Repository**

   Clone the repository to your local machine:

   ```bash
   git clone https://github.com/khooch01/discord_music_bot.git
   cd discord_music_bot

2. **Install Dependencies**

    Install the necessary dependencies using npm:

    ```bash
    npm install

3. **Set Up Environment Variables**
    Create a .env file in the root directory and add your credentials:

    ```env
    DISCORD_BOT_TOKEN=your_discord_bot_token
    SPOTIFY_CLIENT_ID=your_spotify_client_id
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

4. **FFMPEG Installation**
    Ensure ffmpeg is installed and accessible in your system's PATH. You can download it from FFMPEG's official site.

5. **Run the Bot**
    Run the bot using the following command:
    ```bash
    node index.js

## Usage
Commands
    !play [song name or URL]: Plays a song from Spotify, SoundCloud, or YouTube.
    !pause: Pauses the current song.
    !resume: Resumes the paused song.
    !skip: Skips to the next song in the queue.
    !stop: Stops the music and leaves the voice channel.
    !queue: Shows the current queue of songs.

## Acknowledgments
DisTube - A powerful and flexible library for playing music in Discord.
Discord.js - The Discord API library for Node.js.
FFMPEG - For audio processing.