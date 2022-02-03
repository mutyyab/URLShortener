const express = require("express")
const Database = require("better-sqlite3")

const app = express.Router()
app.use(express.urlencoded({ extended: true }))
const db = Database("database.db")

const config = require("../config.json")

const createTableStatement = db.prepare('CREATE TABLE IF NOT EXISTS admins (username text, password text, primary key("username"))')
createTableStatement.run()

const adminUsername = process.env.adminuser || config.adminPortalUsername
const adminPassword = process.env.adminpass || config.adminPortalPassword

const checkIfAccountExist = db.prepare("SELECT * FROM admins WHERE username = ?")
const checkData = checkIfAccountExist.get(adminUsername)

if (!checkData) {
    const insertDefaultAccount = db.prepare("INSERT INTO admins (username, password) VALUES (?, ?)")
    insertDefaultAccount.run(adminUsername, adminPassword)
}

app.post("/admin", (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (!(username && password)) return res.send({ success: true, cause: "Username or password not provided!" })

    const selectDataStatement = db.prepare("SELECT * FROM links")
    const data = selectDataStatement.all()

    res.send({
        success: true,
        data: data
    })

    return
})

module.exports = app