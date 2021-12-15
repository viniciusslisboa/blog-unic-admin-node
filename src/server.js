// set variables
const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const { engine } = require('express-handlebars')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const Posts = require('./database/models/Post')
const Categories = require('./database/models/Category')
// config session 
app.use(session({
    secret: "md15vini15md15vini15",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
      
    }
}))
app.use(flash())

// middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.warning_msg = req.flash("warning_msg")
    next()
})
// config bodyparser
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

// set exports 
const admin = require('./routes/admin')
const user = require('./routes/user')
// router instance prefix
app.use('/admin', admin)
app.use('/auth', user)
// config handlebars
app.engine('handlebars', engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, "views"))

// config static/public
// app.use(express.static(path.join(__dirname, "src", "public")))

// routes
app.get('/', async (req, res) => {
    try {
        const posts = await Posts.find({}).populate("category").sort({ createdAt: "desc"})
        res.status(200).render("index/landing", {post: posts})
    } catch (err) {
        req.flash("error_msg", "No posts found")
        res.redirect('/')
    }
})

app.get('/posts/:slug', async (req, res) => {
    try {
        const post = await Posts.findOne({slug: req.params.slug})
        
        if(!post) {
                req.flash("error_msg", "This post does not exist.")
                res.redirect('/')

        } else {
            res.render('posts/indexPostpage', { post: post })
        }
    } catch (err) {
        req.flash("error_msg", "Error finding post." )
        res.redirect('/')
    }
})

app.get('/posts', (req, res) => {
    res.render('posts/indexPostpage')
})

app.get('/categorys', async (req, res) => {
    try {
        const categs = await Categories.find({}).sort({createdAt: "desc"})
        res.render('categs/indexCategpage', {categs: categs})
    } catch (err) {
        req.flash("error_msg", "No categories found")
        res.redirect('/')
    }
        
})

app.get('/categorys/:slug', async (req, res) => {
    try {
        const categs = await Categories.findOne({slug: req.params.slug})

        if(!categs) {
            req.flash("error_msg", "There are no posts for this category.")
            res.redirect('/')
            

        }else {
            const posts = await Posts.find({category: categs._id}).sort({ createdAt: "desc"})

            res.render('categs/listPostsPerCateg', {post: posts, categs: categs})
        }

        
    } catch (err) {
        req.flash("error_msg", "Error finding post.")
        res.redirect('/')
    }
        
})


app.get('/404', (req, res) => {
    res.send('erro')
})


// set listen
const PORT = 8080
app.listen(PORT, (req, res) => {
    console.log(`listen at port ${PORT}`)
})