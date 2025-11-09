    
// app.js wasnt supposed to be called to set up routes, routes have been ported to /routes

// interactable with the database 
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;


// -----------------------------------------------
// Load environment variables
// -----------------------------------------------

// Middleware
app.use(express.json()); // parse JSON bodies


// Connect to MongoDB

// i dont know what this is? i just copied from documentation, lol
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));


// Routes (already ported to /routes)

const routes = require("./routes"); // adjust path if needed
app.use("/api", routes);



// Start server

app.listen(port, () => {
  console.log(``);
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown

process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  await sql.close();
  console.log("Database connections closed");
  process.exit(0);
});