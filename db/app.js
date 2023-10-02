const express = require("express")
const app = express()
const { getTopics, getEndpoints, getArticleById } = require("./app.controllers")


app.get("/api/topics" , getTopics)
app.get("/api" , getEndpoints)
app.get("/api/articles/:article_id", getArticleById)

app.use((err, req, res, next) => {
    console.log(err)
    if (err.code === "22P02"){
        res.status(400).send({message : "Bad Request!"})
    }
    next(err)
})
app.use((err, req, res, next) => {
    if (err.status){
        res.status(err.status).send({message: err.message})
    }
    next(err)
})

app.all("/*", (req, res, next) => {
    res.status(404).send({message : "Path Not Found!"})
})

module.exports = app