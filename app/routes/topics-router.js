const topicsRouter = require("express").Router()
const { getTopics } = require("../app.controllers")

topicsRouter.get("/" , getTopics)

module.exports = topicsRouter