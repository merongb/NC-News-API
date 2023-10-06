const articlesRouter = require("express").Router()
const { getArticles,
    getArticleById,
    getCommentsByArticleId,
    postCommentByArticleId,
    patchArticleVotesById,    } = require("../app.controllers")

articlesRouter.get("/", getArticles)
articlesRouter.get("/:article_id", getArticleById)
articlesRouter.get("/:article_id/comments", getCommentsByArticleId)
articlesRouter.post("/:article_id/comments", postCommentByArticleId)
articlesRouter.patch("/:article_id", patchArticleVotesById)


module.exports = articlesRouter