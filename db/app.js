const express = require("express")
const app = express()
const { getTopics, getEndpoints, getArticles } = require("./app.controllers")


app.get("/api/topics" , getTopics)
app.get("/api" , getEndpoints)

app.get("/api/articles", getArticles)
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({message : "Server error"})
})

app.all("/*", (req, res, next) => {
    res.status(404).send({message : "Path Not Found!"})
})

module.exports = app