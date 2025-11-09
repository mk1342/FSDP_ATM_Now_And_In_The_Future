
// app.js wasnt supposed to be called to set up routes, routes have been ported to /routes
//find out why thats the case

//// interactable with the database 
const express = require("express");
const dotenv = require("dotenv");

const app = express();
const port = process.env.PORT || 3000;


// -----------------------------------------------
// Load environment variables
// all image routes, app.use should be placed here
// not made yet
// -----------------------------------------------

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  await sql.close();
  console.log("Database connections closed");
  process.exit(0);
});