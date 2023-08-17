const fs = require("fs");
const { google } = require("googleapis");
const service = google.sheets("v4");
// const {credentials, discordToken} = require("./credentials.json"); ASK ME FOR THE CREDENTIALS
const Discord = require("discord.js");
const { Client, Intents } = require('discord.js');
const { identitytoolkit } = require("googleapis/build/src/apis/identitytoolkit");
const { time } = require("console");
const guildId = "708421411693264926"; // Change based on server. current id only used as a test server

const bot = new Discord.Client({ intents: [Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES] });
const discordToken = "ASK ME FOR THE TOKEN";

var currentDate = new Date();

// All of the answers
var answers = [];
var identification = [];
var numOfEntries = 0;


bot.on("ready", async () =>{
    console.log("ready");
    const guild = bot.guilds.fetch(guildId);

    function execute(){
    
    let newData = false;
    let data = get();
    data.then(metadata =>{
        if(numOfEntries === metadata.data.values.length){
            console.log("\nNo new entries at this time\n");
            return;
        }else {
            console.log("\n\n\n\n\n\n\n\n\n\nNew entries detected");
            numOfEntries = metadata.data.values.length;
            newData = true;
        }
    })
    data.then(() => {
        if(newData){
            let res  = writeId(data);
            manageRoles(res);
            }})
    
    //reset to prevent duplication
    identification = [];
    answers = [];
}

execute();
setInterval(execute, 10000);

})

bot.login(discordToken);
