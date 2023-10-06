const commentsRouter = require("express").Router()
const { deleteCommentById,} = require("../app.controllers")

commentsRouter.delete("/:comment_id", deleteCommentById)

module.exports = commentsRouter