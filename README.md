# Comet-Rocketry-Bot
Node.js app designed to take and record attendance for the Comet Rocketry branch of AIAA at UTD. Utilizes a spreadsheet of data integrated to a Google form to 
read and give roles according to valid attendance entries corresponding to members of the AIAA Discord server. Also writes names and attendance count in a separate, "filtered" spreadsheet. Capable of running autonomously 24/7.
*Code is fully functional but may need more optimization bc I don't code..

BEFORE USING: 
1. INSTALL Discord.js to main in order for code to work >> npm install discord.js --save
2. INSTALL googleapis >> npm install googleapis --save (OR >>npm install @googleapis/sheets ,since sheets is the only API used)
4. CHECK validity of spreadsheetId for the spreadsheet you want to read. Also check the spreadsheetId of the filtered spreadsheet you will write to.
5. CHECK guildId (your Discord server's ID) and make sure it corresponds to the Discord server you would like to use the bot in.
6. ASK me or PLUG IN(***) your own valid credientals and tokens for the Discord and Google API.

   ***If plugging in your own credientials/tokens, make sure to have your own google cloud project set up with proper scopes regarding the sheets API, your own discord bot with proper scopes, etc.)

HOW IT WORKS:
1. Read spreadsheet of raw data coming from google form filled out. Entries are presented in the following format: {[timeStamp], [name], [netid]}
2. Check if there are new entries compared to last run. If there are no new entries, skip to step 7.
3. Compare each entry to an array, labeled identity, storing unique entries and their number of attendances in the spreadsheet (called tally), in the form {[name], [tally]}.
4. If name OR netid matches. compare timeStamp. If times are more than one day apart, add 1 to tally under the name of who submits the entry.
5. Search for nickname in Discord server corresponding to name under the array identity. If match, assign role based on tally value.
6. List name and tally in separate spreadsheet.
7. Repeat every 10 seconds.

