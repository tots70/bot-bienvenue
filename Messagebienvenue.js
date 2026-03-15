const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config(); // pour lire le token depuis .env

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
    ]
});

const TOKEN = process.env.TOKEN; // <-- le token n’est plus en dur

const WELCOME_CHANNEL_ID = "1480204926696165629";

client.on('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
    if (!channel) return console.log("Salon non trouvé ou accès refusé.");

    const embed = new EmbedBuilder()
        .setColor('#ff6600')
        .setTitle(`Bienvenue à ${member.user.username} !`)
        .setDescription('Tu rejoins la **POG Family** 🎉')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setTimestamp();

    channel.send({ embeds: [embed] }).catch(err => console.log("Erreur en envoyant le message :", err));
});

client.login(TOKEN).catch(err => console.log("Erreur de connexion :", err));