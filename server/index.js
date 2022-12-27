const path = require('path')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const compression = require('compression')
const sessionExpress = require('express-session')
const passport = require('passport')
const SequelizeStore = require('connect-session-sequelize')(sessionExpress.Store)
// const db = require('./db')
// const sessionStore = new SequelizeStore({db})
const PORT = process.env.PORT || 8080
const app = express()
const socketio = require('socket.io')
// const neo4j = require('neo4j-driver').v1;
// const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
// const neoSession = driver.session();
const {session} = require('../server/db/neo')
module.exports = app

// This is a global Mocha hook, used for resource cleanup.
// Otherwise, Mocha v4+ never quits after tests.
// if (process.env.NODE_ENV === 'test') {
//   after('close the session store', () => sessionStore.stopExpiringSessions())
// }

/**
 * In your development environment, you can keep all of your
 * app's secret API keys in a file called `secrets.js`, in your project
 * root. This file is included in the .gitignore - it will NOT be tracked
 * or show up on Github. On your production server, you can add these
 * keys as environment variables, so that they can still be read by the
 * Node process on process.env
 */
if (process.env.NODE_ENV !== 'production') require('../secrets')

// passport registration
passport.serializeUser((user, done) => {done(null, user.name) })

passport.deserializeUser(async (name, done) => {
  try {
    const response = 