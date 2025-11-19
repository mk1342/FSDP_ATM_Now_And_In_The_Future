
// app.js wasnt supposed to be called to set up routes, routes have been ported to /routes
// TODO:// connect app.js to Run.ps1, then everything inside /backend
// TODO:// Main application file to set up Express server and make it
// also app.js move to /backend?

// interactable with the database 
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require('cors'); // Cross-Origin Resource Sharing
const userRoutes = require("./backend/routes/userroutes"); // idk its 4am   
// Import routes



dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// -----------------------------------------------
// Load environment variables
// -----------------------------------------------

// Middleware
app.use(express.json()); // parse JSON bodies
app.use(cors());
app.use("/api/users", userRoutes); // http://localhost:3000/api/users ROUTES TO THIS ONE, PLEASE


// connect to mongodb using mongoose
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));



// Test route
app.get('/', (req, res) => res.send('CRUD test server running')); // i dont think this is needed


// Routes (already ported to /routes) (then why is it here TODO:// fix)
const routes = require("./backend/routes/userroutes.js"); // adjust path if needed
app.use("/api", routes);


// Start server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

// Graceful shutdown

process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down");
    await sql.close();
    console.log("Database connections closed");
    process.exit(0);
});


// pelase

/* To verify in MongoDB Compass:
1. Open MongoDB Compass.
2. Connect to your MongoDB instance using the same connection string as in your MONGO_URI.
3. After connecting, you should see the list of databases on the left sidebar.
4. If your database does not appear immediately, try refreshing the database list.
5. Look for the database name you specified in your MONGO_URI.
6. Click on the database to expand it and view its collections.


/* 
If your Express app has a model (example: User), just run any POST request that creates data.

Example POST:

POST http://localhost:3000/api/users/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

After successful insertion, MongoDB will automatically create:

database: whatever you put in MONGO_URI

collection: users

document: the inserted user

Then Compass will immediately show the DB. */