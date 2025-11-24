import { google } from "googleapis";
import fs from "fs";

const auth = new google.auth.GoogleAuth({
    keyFile: "google-cloud-credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
});

const sheets = google.sheets({ version: "v4", auth });


const spreadsheetId = "1ChskOeoHdyMiVLgOTnHryuww23uoSnZgSilFCGA6ego";


const range = "Form Responses 1!A:F";

async function pullSheet() {
    try {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range
        });

        const rows = res.data.values || [];

        // Remove the header row (first row)
        const dataRows = rows.slice(1);

        // saves the data
        fs.writeFileSync("data/responses.json", JSON.stringify(dataRows, null, 2));
        //                                                  This can be removed if its just bloat
        console.log("responses.json updated successfully:", new Date().toLocaleTimeString());
    } catch (err) {
        console.error("Error reading Google Sheets:", err);
    }
}

pullSheet();
setInterval(pullSheet, 20000); // updates every 20 seconds so that it can technically show the data in real time
