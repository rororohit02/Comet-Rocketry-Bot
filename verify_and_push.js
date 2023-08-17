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
        // Saved the answers
        fs.writeFileSync("./answers.json", JSON.stringify(answers));
        return(identification);
    }