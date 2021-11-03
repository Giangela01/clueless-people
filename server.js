//Dependencies
require("dotenv").config();
const { PORT = 3000, MONGODB_URL } = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
//Middleware dependencies
const cors = require("cors");
const morgan = require("morgan");

//Database Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
//Connection Events
mongoose.connection
  .on("open", () => console.log("Your are connected to mongoose"))
  .on("close", () => console.log("Your are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

//Models
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
})

const People = mongoose.model("People", PeopleSchema);
//Middleware
app.use(cors()); //prevent cors errors, open access to all origin
app.use(morgan("dev")); //logging
app.use(express.json()); // parse json bodies

//Routes
//Test Route
app.get("/", (req, res) => {
    res.send("hello world")
})
//PEOPLE INDEX route
app.get("/people", async (req, res) => {
    try {
      // send all people
      res.json(await People.find({}));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
//PEOPLE CREATE route
app.post("/people", async (req, res) => {
    try {
      // send all people
      res.json(await People.create(req.body));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
//PEOPLE UPDATE route
// update route - put request to /people/:id
// update a specified person
app.put("/people/:id", async (req, res) => {
    try {
        res.json(
            await People.findByIdAndUpdate(req.params.id, req.body, {new: true})
        )
    } catch (error){
        res.status(400).json({error})
    }
})
//PEOPLE DELETE Route
// destroy route - delete request to /people/:id
// delete a specific people
app.delete("/people/:id", async (req, res) => {
    try {
      res.json(await People.findByIdAndRemove(req.params.id));
    } catch (error) {
      res.status(400).json({ error });
    }
  });
  
app.listen(PORT, () => console.log(`listening to PORT ${PORT}`));