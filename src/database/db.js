const mongoose = require('mongoose')
const database = "mongodb://localhost/expblog"


mongoose.connect(database).then(() => {
    console.log('connected')
}).catch(() => {
    console.log(err)
})
mongoose.Promise = global.Promise


module.exports = mongoose