const spreadsheetId = "1IOVv019MvLinFL_GylPrFZGM3ub29kurSnUOCm-kyt0";
const range = "A:C"

//Configure Auth Client
const authClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
);

const token = await authClient.authorize();
authClient.setCredentials(token);

//Get data from spreadsheet, return in JSON format
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
