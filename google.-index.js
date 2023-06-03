const fs = require("fs");
const { google } = require("googleapis");

const service = google.sheets("v4");
const credentials = require("./credentials.json");

const Discord = require("discord.js")
const { MessageEmbed } = require('discord.js')
const { Client, Intents } = require('discord.js');

const bot = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

const discordToken = "MTExMzUwMjI5Njg3NDE1NjA5Mg.GDb-e7.p5lrXu9AdBhxfHW-C--KwPkWQFpylpe8SzbyUc"

bot.on("ready", () =>{
    console.log("Online")
})


// Configure auth client
const authClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
);

(async function () {
    try {

        // Authorize the client
        const token = await authClient.authorize();

        // Set the client credentials
        authClient.setCredentials(token);
        // Get the rows
        const res = await service.spreadsheets.values.get({
            auth: authClient,
            spreadsheetId: "1aY4TviUnqOgybFyVjZAIQTAQNyOJgGOpCcDZnLbU2iU",
            range: "A:B",
        });

        // All of the answers
        const answers = [];

        // Set rows to equal the rows
        const rows = res.data.values;

        // Check if we have any data and if we do add it to our answers array
        if (rows.length) {

            // Remove the headers
            rows.shift()

            // For each row
            for (const row of rows) {
                answers.push({ timeStamp: row[0], answer: row[1] });
            }

        } else {
            console.log("No data found.");  
        }

        // Saved the answers
        fs.writeFileSync("answers.json", JSON.stringify(answers), function (err, file) {
            if (err) throw err;
            console.log("Saved!");
        });

    } catch (error) {

        // Log the error
        console.log(error);

        // Exit the process with error
        process.exit(1);

    }

})();

bot.login(discordToken)