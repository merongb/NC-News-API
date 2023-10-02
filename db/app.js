const express = require("express")
const app = express()

const { getTopics } = require("./app.controllers")


app.get("/api/topics" , getTopics)

app.use((err, req, res, next) => {
    console.log(err)
    
})

app.all("/*", (req, res, next) => {
    res.status(404).send({ message : "Path Not Found!"})
})

module.exports = app