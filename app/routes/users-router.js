const usersRouter = require("express").Router()
const { getUsers,
    getUserByUsername } = require("../app.controllers")

usersRouter.get("/", getUsers)
usersRouter.get("/:username", getUserByUsername)

module.exports = usersRouter