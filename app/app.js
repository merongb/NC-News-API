const cors = require('cors');

const express = require("express")
const app = express()
app.use(cors())


app.use(express.json())
const apiRouter = require('./routes/api-router');

app.use('/api', apiRouter)


app.use((err, req, res, next) => {
    if (err.code === "23503"){
        res.status(404).send({message : "User Not Found"})
    }
    if (err.code === "22P02"){
        res.status(400).send({message : "Bad Request!"})
    } else if (err.status){
        res.status(err.status).send({message: err.message})
    } else {
        console.log(err);
        res.status(500).send({message: "Internal Server Error"})
    }
})

app.all("/*", (req, res, next) => {
    res.status(404).send({message : "Path Not Found!"})
})

module.exports = app