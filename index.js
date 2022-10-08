require("dotenv").config() // get you env variables
const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const cors = require("cors")
// API routes
const users = require("./routes/api/users")
const admin = require("./routes/api/admin")
const profile = require("./routes/api/profile")
const menu = require("./routes/api/menu")

const app = express()

app.use(cors())

// Body parser middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// DB URI
const { mongoURI } = require("./config/keys")
// Connect to mongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to mongoDB"))
  .catch((err) => console.log(err.message))

// Passport Middleware
// app.use(passport.initialize());

// Passport Config
// require("./config/passport.js")(passport);

//Use routes
app.use("/api/users", users)
app.use("/api/admin", admin)
app.use("/api/profile", profile)
app.use("/api/menu", menu)

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
