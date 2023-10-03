const { selectTopics, selectArticleById, selectArticles, selectCommentsByArticleId } = require("./app.models")
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

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
 
    selectArticleById(article_id).then((article) => {
     res.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
 }

 exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    
    selectArticleById(article_id)
    .then((article) => {
        selectCommentsByArticleId(article_id)
        .then((comments) => {
            res.status(200).send({ comments });
        })
        .catch((err) => {
            next(err);
        });
    }).catch((err) => {
        next(err)
    })
};