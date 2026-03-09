require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers 
    ] 
});

client.on('ready', () => {
    console.log(`${client.user.tag} est prêt à surveiller les retards !`);
});

client.on('messageCreate', async message => {
    // Si quelqu'un tape la commande !retard
    if (message.content === '!retard') {
        try {
            await message.delete();
        } catch (error) {
            console.error("Le bot n'a pas la permission de supprimer des messages.");
        }
        // 1. Remplace les chiffres ci-dessous par l'ID Discord de Norah
        const norahId = '689183282356813991'; 
        
        // 2. On cherche Norah sur le serveur
        const membre = await message.guild.members.fetch(norahId).catch(() => null);
        
        // 3. On cherche le rôle "tortue" (vérifie bien l'orthographe/majuscule)
        const roleTortue = message.guild.roles.cache.find(r => r.name === 'Tortue 🐢');

        // On envoie le message dans le salon
        const sentMessage = await message.channel.send(`Oh <@${norahId}> est en retard ? Etonnant...`);
        sentMessage.react('🐢');
        // On ajoute le rôle à Norah si elle est trouvée et que le rôle existe
        if (membre && roleTortue) {
            try {
                await membre.roles.add(roleTortue);
                console.log("Rôle tortue attribué à Norah.");
                
                const duree = 3600000;
                
                setTimeout(async () => {
                    if (membre.roles.cache.has(roleTortue.id)) {
                        await membre.roles.remove(roleTortue);
                        console.log("Rôle tortue retiré automatiquement.");
                    }
                }, duree);
            } catch (error) {
                console.error("Erreur : Vérifie que le bot est au-dessus du rôle tortue dans les paramètres du serveur !");
            }
        } else {
            console.log("Erreur : Norah ou le rôle 'tortue' n'a pas été trouvé.");
        }
    }
});

client.login(process.env.TOKEN);