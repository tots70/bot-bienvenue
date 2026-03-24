require('dotenv').config();
const express = require("express");
const axios = require("axios");
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

// ---------------------
// 🌐 Serveur web pour Railway + UptimeRobot
// ---------------------
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.status(200).send("Bot en ligne ✅"));
app.listen(PORT, () => console.log(`🌐 Serveur web actif sur le port ${PORT}`));

// ---------------------
// 🤖 Bot Discord
// ---------------------
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, // nécessaire pour guildMemberAdd
    GatewayIntentBits.GuildMessages
  ]
});

// ID du salon de bienvenue
const WELCOME_CHANNEL_ID = "1480204926696165629";

// ---------------------
// 🔥 Quand le bot est prêt
// ---------------------
client.on('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
  
  // Force le statut en ligne et ajoute une activité
  client.user.setStatus("online");
  client.user.setActivity("POG Family 🚀", { type: "WATCHING" });
});

// ---------------------
// 👋 Message de bienvenue
// ---------------------
client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (!channel) return console.log("❌ Salon non trouvé ou accès refusé.");

  const embed = new EmbedBuilder()
    .setColor('#ff6600')
    .setTitle(`Bienvenue à ${member.user.username} !`)
    .setDescription('Tu rejoins la **POG Family** 🎉')
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
    .setTimestamp();

  channel.send({ embeds: [embed] }).catch(err => console.log("❌ Erreur en envoyant le message :", err));
});

// ---------------------
// 🚀 Connexion du bot avec gestion des erreurs
// ---------------------
(async () => {
  try {
    if (!process.env.TOKEN) throw new Error("TOKEN manquant !");
    await client.login(process.env.TOKEN);
  } catch (err) {
    console.log("❌ Erreur de connexion :", err);
  }
})();

// ---------------------
// 🔁 Keep Alive via ping automatique (facultatif si UptimeRobot utilisé)
// ---------------------
const URL = process.env.URL || "https://mon-bot.up.railway.app/"; // Remplace par ton URL Railway
setInterval(() => {
  axios.get(URL)
    .then(() => console.log("🔁 Ping OK"))
    .catch(() => console.log("❌ Ping failed"));
}, 4 * 60 * 1000); // toutes les 4 minutes

// ---------------------
// ⚠️ Gestion des erreurs globales pour éviter crash
// ---------------------
process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

client.on('error', console.error);
client.on('warn', console.warn);

// ---------------------
// 🔁 Auto-reconnect si le bot se déconnecte
// ---------------------
client.on('shardDisconnect', async () => {
  console.log(`⚠️ Déconnecté, tentative de reconnexion...`);
  try {
    await client.login(process.env.TOKEN);
  } catch (err) {
    console.log("❌ Erreur lors de la reconnexion :", err);
  }
});