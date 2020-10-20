const express = require("express");
const app = express();
const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/userServer";

// Connect server to mongo db database
mongoose.connect(url, { useNewUrlParser: true });
const connector = mongoose.connection;
connector.on("open", function () {
  console.log("Connected to the database...");
});

// Importing routes
const authUserRoute = require("./routes/authUser");

// Route middlewares
app.use("/api/user", authUserRoute);

app.listen(3000, () => {
  console.log("Server started successfully...");
});
