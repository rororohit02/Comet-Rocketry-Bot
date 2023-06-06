# Comet-Rocketry-Bot
Designed to take and record attendance for the comet rocketry branch of AIAA at UTD. Utilizes a spreadsheet of data connected to a google form to 
read and give roles according to valid attendance entries corresponding to members of the AIAA Discord server.

BEFORE USING: 
1. INSTALL Discord.js to main in order for code to work >> npm install discord.js --save
2. CHECK validity of bot token for the Discord bot.
3. CHECK validity of spreadsheetId for the spreadsheet you want to read. Make sure that the corresponding Google cloud project is linked to that spreadsheet and has (at least) viewer access.
4. CHECK guildId and make sure it corresponds to the Discord server you would like to use the bot in.
5. ASK me for valid credientals and tokens for the Discord and Google API.

HOW IT WORKS:
1. Read spreadsheet of raw data coming from google form filled out. Entries are presented in the following format: {[timeStamp], [name], [netid]}
2. Check if there are new entries compared to last run. If there are no new entries, skip to step 6.
3. Compare each entry to an array, labeled identity, storing unique entries and their frequency in the spreadsheet (tally), in the form {[name], [tally]}.
4. If name OR netid matches. compare timeStamp. If times are more than one day apart, add 1 to tally under the name of who submits the entry.
5. Search for nickname in Discord server corresponding to name under the array identity. If match, assign role based on tally value.
6. Repeat every 10 seconds.

