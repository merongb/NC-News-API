const { selectTopics, selectArticles } = require("./app.models")
const endpoints = require('../endpoints.json')


exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({ topics })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getEndpoints = (req, res) => {
   res.status(200).send(endpoints)
}

exports.getArticles = (req, res, next) => {

    selectArticles().then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}