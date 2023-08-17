
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

function manageRoles(response) {
    response.then(async identification =>{
        for(let i = 0; i < identification.length; i++){
            let memberFetch = (await guild).members.fetch();
            memberFetch.then(response =>{
                let guildMember = Array.from(response.values()).find(member => member.nickname && member.nickname.toLowerCase() === identification[i].name.toLowerCase());
                if(guildMember){
                    let tally = identification[i].tally;
                    console.log([guildMember.nickname, tally]);
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