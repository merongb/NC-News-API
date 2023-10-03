const express = require("express")
const app = express()
const { getTopics, getEndpoints, getArticles, getArticleById, getCommentsByArticleId, postCommentByArticleId } = require("./app.controllers")
app.use(express.json())

app.get("/api/topics" , getTopics)
app.get("/api" , getEndpoints)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)
app.post("/api/articles/:article_id/comments", postCommentByArticleId)


app.use((err, req, res, next) => {
    if (err.code === "22P02"){
        res.status(400).send({message : "Bad Request!"})
    } else if (err.status){
        res.status(err.status).send({message: err.message})
    } else {
        console.error(err);
        res.status(500).send({message: "Internal Server Error"})
    }
})

app.all("/*", (req, res, next) => {
    res.status(404).send({message : "Path Not Found!"})
})

module.exports = app