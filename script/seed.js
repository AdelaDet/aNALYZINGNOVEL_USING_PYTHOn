// 'use strict'

// const db = require('../server/db')
// const {User} = require('../server/db/models')

// /**
//  * Welcome to the seed file! This seed file uses a newer language feature called...
//  *
//  *                  -=-= ASYNC...AWAIT -=-=
//  *
//  * Async-await is a joy to use! Read more about it in the MDN docs:
//  *
//  * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
//  *
//  * Now that you've got the main idea, check it out in practice below!
//  */

// async function seed() {
//   await db.sync({force: true})
//   console.log('db synced!')
//   // Whoa! Because we `await` the promise that db.sync returns, the next line will not be
//   // executed until that promise resolves!
//   const users = await Promise.all([
//     User.create({email: 'cody@email.com', password: '123'}),
//     User.create({email: 'murphy@email.com', password: '123'})
//   ])
//   // Wowzers! We can even `await` on the right-hand side of the assignment operator
/