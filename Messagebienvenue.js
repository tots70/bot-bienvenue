require('dotenv').config(); // charge les variables d'environnement

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

// Vérifie que le token Render est bien lu
console.log("TOKEN Render :", process.env.TOKEN);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
    ]
});

const WELCOME_CHANNEL_ID = "1480204926696165629";

// Quand le bot est prêt
client.on('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
});

// Accueil des nouveaux membres
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

// Démarrage du bot
(async () => {
    try {
        await client.login(process.env.TOKEN); // utilise bien la variable d'environnement
    } catch (err) {
        console.log("Erreur de connexion :", err);
    }
})();