require('dotenv').config();

const express = require("express");
const axios = require("axios");
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const app = express();
const PORT = process.env.PORT || 3000;

// 🌐 Serveur web (pour Render + UptimeRobot)
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`🌐 Serveur web actif sur le port ${PORT}`);
});

// 🤖 Configuration du bot Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

const WELCOME_CHANNEL_ID = "1480204926696165629";

// 🔥 Quand le bot est prêt
client.on('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
  
  // Activité du bot (optionnel mais stylé)
  client.user.setActivity("POG Family 🚀");
});

// 👋 Message de bienvenue
client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (!channel) return console.log("❌ Salon non trouvé ou accès refusé.");

  const embed = new EmbedBuilder()
    .setColor('#ff6600')
    .setTitle(`Bienvenue à ${member.user.username} !`)
    .setDescription('Tu rejoins la **POG Family** 🎉')
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
    .setTimestamp();

  channel.send({ embeds: [embed] })
    .catch(err => console.log("❌ Erreur en envoyant le message :", err));
});

// 🚀 Connexion du bot
(async () => {
  try {
    if (!process.env.TOKEN) {
      throw new Error("TOKEN manquant dans les variables d'environnement !");
    }

    await client.login(process.env.TOKEN);
  } catch (err) {
    console.log("❌ Erreur de connexion :", err);
  }
})();

// 🔁 Auto-ping (remplace TON-URL par ton lien Render)
const URL = "https://bot-bienvenue-reel.onrender.com";

setInterval(() => {
  fetch("https://bot-bienvenue-reel.onrender.com")
    .then(() => console.log("🔁 Ping OK"))
    .catch(() => console.log("❌ Ping failed"));
}, 4 * 60 * 1000);