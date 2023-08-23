//TODO: Optimize

const fs = require("fs");
const { google } = require("googleapis");
const service = google.sheets("v4");
const credentials = require("./credentials.json");
const Discord = require("discord.js");
const { Client, Intents } = require('discord.js');
const { identitytoolkit } = require("googleapis/build/src/apis/identitytoolkit");
const { time } = require("console");
const guildId = "708421411693264926"; // Change based on server. current id only used as a test server
const spreadsheetId = "1IOVv019MvLinFL_GylPrFZGM3ub29kurSnUOCm-kyt0";
const range = "A:C";

const bot = new Discord.Client({ intents: [Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES] });

var currentDate = new Date();
// All of the answers
var answers = [];
var identification = [];
var numOfEntries = 0;
const authClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
);


bot.on("ready", async () =>{
    console.log("ready");
    const token = await authClient.authorize();
    authClient.setCredentials(token);
    
    const guild = bot.guilds.fetch(guildId);

    let roleNames = ["test1", "test2", "test3"];
    let roleList = [0, 0, 0];
    for(let i = 0; i < 3; i++){
    let roleFetch = (await guild).roles.fetch();
            roleFetch.then(response =>{
            let role = Array.from(response.values()).find(role => role.name === roleNames[i]);
            if(role){
                roleList[i] = role;
            }
        })
    }
    // Get data from spreadsheet, return in JSON format
    async function get() {  
        try {
            // Get the rows
            const res = await service.spreadsheets.values.get({
                auth: authClient,
                spreadsheetId: spreadsheetId,
                range: range,
            });
            return(res);
        } catch(error){
            console.log(error);
            process.exit(1);
        }
    }
    function manageRolesAndSpreadsheet(response) {
        response.then(async identification =>{
            for(let i = 0; i < identification.length; i++){
                let memberFetch = (await guild).members.fetch();
                memberFetch.then(response =>{
                    let guildMember = Array.from(response.values()).find(member => member.nickname && member.nickname.toLowerCase() === identification[i].name.toLowerCase());
                    if(guildMember){
                        let tally = identification[i].tally;
                        console.log([guildMember.nickname, tally]);
                        //Write name in separate spreadsheet
                        service.spreadsheets.values.update({
                            auth: authClient,
                            spreadsheetId: "1ZzGgH2K_l1cIBe2g2QHN1Grw6Mng6cP9L4vBLX1z2iw",
                            range: `A${i+2}`,
                            valueInputOption: "USER_ENTERED",
                            resource: {
                                values: [[guildMember.nickname]]
                                }
                        })
                        //Update tally in same spreadsheet as above
                        service.spreadsheets.values.update({
                            auth: authClient,
                            spreadsheetId: "1ZzGgH2K_l1cIBe2g2QHN1Grw6Mng6cP9L4vBLX1z2iw",
                            range: `B${i+2}`,
                            valueInputOption: "USER_ENTERED",
                            resource: {
                                values: [[tally]]
                                }
                        })
                        if (tally > 1 && tally < 4){
                            guildMember.roles.add(roleList[0]);
                        } else if (tally >= 4 && tally < 6){
                            guildMember.roles.add(roleList[1]);
                            guildMember.roles.remove(roleList[0]);
                        } else if( tally >= 6){
                            guildMember.roles.add(roleList[2]);
                            guildMember.roles.remove(roleList[1]);
                    }
                }
            })
            }
        })
    
    }
    async function writeId(res) {
        console.log("Running new");
    
        // log time of req
        let timeStamp = "Timestamp (MM/DD/YYYY @ HH:MM:SS): " + (currentDate.getMonth()+1) + "/"
        + currentDate.getDate()  + "/" 
        + currentDate.getFullYear() + " @ "  
        + currentDate.getHours() + ":"  
        + currentDate.getMinutes() + ":" 
        + currentDate.getSeconds();
    
        console.log(timeStamp);
            // Set rows to equal the rows
            const rows = (await get()).data.values;
    
            // Check if we have any data and if we do add it to our answers array
            if (rows.length) {
            // Remove the headers
            rows.shift();
            // For each row
            for (const row of rows) {
                let uniqueChecker = true;
                let isInputValid = true;
                let netidArray = Array.from(row[2]);
                let netidLetter = [0,1,2].map(x=>netidArray[x]);
                let netidNumber = [3,4,5,6,7,8].map(x=>netidArray[x]);
                if (netidArray.length !== 9){
                    isInputValid = false;
                }
                //test name for validity
                if(!Boolean(/\s/.test(row[1])) && !Boolean(/^[a-zA-Z]*$/.test(row[1]))){
                    isInputValid = false;
                }
                //test netid for validity
                for(const letter of netidLetter){
                    if (!(Boolean((`${letter}`).match(/^[a-zA-Z]*$/)))){
                        isInputValid = false;
                    }
                }
                for(const number of netidNumber){
                    if (!(Boolean((`${number}`).match(/^[0-9]*$/)))){
                        isInputValid = false;
                    }
                }
                //check if time is valid
                //continue if valid, skip and log in console if not
                if(isInputValid){
                for(let i=0; i<identification.length; i++){
                    if (row[1] == identification[i].name || row[2] == identification[i].netid){  
                        uniqueChecker = false;
                        let timeRow = JSON.stringify(row[0])
                        let timeRowArray = timeRow.split("/")
                        let timeAnswers = JSON.stringify(answers[i].timeStamp)
                        let timeAnswersArray = timeAnswers.split("/")
                        if(timeAnswersArray[0] === timeRowArray[0] && timeAnswersArray[2].split(" ")[0] === timeRowArray[2].split(" ")[0]){
                            if(Math.abs(timeRowArray[1] - timeAnswersArray[1]) >= 1){ // if time between similar entries is more than a day
                                console.log("entry is valid and similar to other entry")
                                identification[i].tally++;
                            }
                        } else {
                            identification[i].tally++;
                        }
                        }
                    }
                    if(uniqueChecker){
                        identification.push({name: row[1], netid : row[2], tally : 1});
                    }
                    answers.push({timeStamp : row[0], name : row[1], netid : row[2]});
                } else  {
                    console.log ("Invalid entry in spreadsheet");
                    console.log(row)
                }
            }
        }
            return(identification);
            
    }

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
            manageRolesAndSpreadsheet(res);
            }})
    
    //reset to prevent duplication
    identification = [];
    answers = [];
}

execute();
setInterval(execute, 10000);

})

bot.login(credentials.discord_token);