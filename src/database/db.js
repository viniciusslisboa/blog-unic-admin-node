const mongoose = require('mongoose')
const database = "mongodb+srv://vviinnii15:vviinnii15@cluster0.k1aay.mongodb.net/blog_unic_admin?retryWrites=true&w=majority"


mongoose.connect(database, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('connected')
}).catch((err) => {
    console.log(err)
})
mongoose.Promise = global.Promise


module.exports = mongoose