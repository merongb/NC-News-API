const commentsRouter = require("express").Router()
const { deleteCommentById,
    patchCommentById} = require("../app.controllers")

commentsRouter.delete("/:comment_id", deleteCommentById)
commentsRouter.patch("/:comment_id", patchCommentById)

module.exports = commentsRouter