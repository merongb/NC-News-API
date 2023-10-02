const express = require("express")
const app = express()
const { getTopics, getEndpoints } = require("./app.controllers")


app.get("/api/topics" , getTopics)
app.get("/api" , getEndpoints)


app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({message : "Server error"})
})

app.all("/*", (req, res, next) => {
    res.status(404).send("Path Not Found!")
})

module.exports = app