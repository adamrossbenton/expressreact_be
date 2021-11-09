////////////////////////////////////////////////
// Dependencies
////////////////////////////////////////////////
require("dotenv").config()
const {PORT = 3000, MONGODB_URL} = process.env
const express = require("express")
const mongoose = require("mongoose")
// CORS = Cross-Origin Resource Sharing
// CORS puts headers on app
// Lets browser know FE and BE are friends
const cors = require("cors")
const morgan = require("morgan")

const app = express()

////////////////////////////////////////////////
// DB
////////////////////////////////////////////////
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})

mongoose.connection
    .on("open", () => {console.log("Connected to Mongo")})
    .on("close", () => {console.log("Disconnected from Mongo")})
    .on("error", (err) => {console.log(err)})

////////////////////////////////////////////////
// Models
////////////////////////////////////////////////
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
})

const People = mongoose.model("People", PeopleSchema)


////////////////////////////////////////////////
// Middleware
////////////////////////////////////////////////
// CORS = Cross-Origin Resource Sharing
// CORS puts headers on app
// Lets browser know FE and BE are friends
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

////////////////////////////////////////////////
// Seed Data
////////////////////////////////////////////////

const people = [
    {
        name: "Sterling Archer",
        image: "https://miro.medium.com/max/1000/0*MBbFTmYOojEXNhMI.png",
        title: "World's Greatest Secret Agent",
    },
    {
        name: "Cyril Figgis",
        image: "https://i.imgur.com/aypgP.jpg",
        title: "ISIS Comptroller",
    },
    {
        name: "Lana Kane",
        image: "https://cdn.costumewall.com/wp-content/uploads/2017/02/lana-kane.jpg",
        title: "Archer's babysitter",
    }
]

////////////////////////////////////////////////
// Routes
////////////////////////////////////////////////

// Seed
app.get("/people/seed", async (req,res) => {
    await People.deleteMany({})
    const startPeople = await People.create(people)
    res.json(startPeople)
})

// Test
app.get("/", (req,res) => {
    res.send("Hello test")
})

// People Index
app.get("/people", async (req,res) => {
    try {
        res.json(await People.find({}))
    } catch (err) {
        res.status(400).json(err)
    }
})

// People Destroy
app.delete("/people/:id", async (req,res) => {
    try {
        res.json(await People.findByIdAndRemove(req.params.id))
    } catch (err) {
        res.response(400).json(err)
    }
})

// People Update
app.put("/people/:id", async (req,res) => {
    try {
        res.json(
            await People.findByIdAndUpdate(req.params.id, req.body, {new: true})
        )
    } catch (err) {
        res.response(400).json(err)
    }
})

// People Create
app.post("/people", async (req,res) => {
    try {
        res.json(await People.create(req.body))
    } catch (err) {
        res.status(400).json(err)
    }
})

// People Show
app.get("/people/:id", async (req,res) => {
    try {
        res.json(
            await People.findById(req.params.id)
        )
    } catch (err) {
        res.status(400).json(err)
    }
})

////////////////////////////////////////////////
// Listener
////////////////////////////////////////////////
app.listen(PORT, () => {console.log(`On ${PORT}`)})