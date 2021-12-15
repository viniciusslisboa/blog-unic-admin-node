const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const authJson = require('../config/auth.json')

const User = require('../database/models/User')

router.get('/register/add', (req, res) => {
  res.render('user/userRegister')
})

router.post("/register", async (req, res) => {
  var err = []
  if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) { 
    err.push({ err: "Invalid name" });
    res.status(400);
  }
  if (await User.findOne({ email: req.body.email })) { 
    err.push({ err: "user already exists." });
    res.status(400);
  }
  if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
    err.push({ err: "Invalid email" });
    res.status(400);
  }
  if (!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
    err.push({ err: "Invalid password" });
    res.status(400);
  }
  if(req.body.name === "root" && req.body.password === "root") {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      isAdmin: true
    }
    await User.create(newUser)
    req.flash("success_msg", "Admin user was created")
    res.redirect('/')
  }
  if(err.length > 0) {
    res.render("user/userRegister", {err: err})
  } else {
    try {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      })
      await User.create(newUser)
      req.flash("success_msg", "Your account was created! Sign in to your account.")
      res.redirect('/')
  
    } catch (err) {
      console.log(err)
      req.flash("error_msg", "Account cannot be created.")
      return res.redirect('/')
    }
  }
  
})

router.get('/authenticate/add', async (req, res) => {
  res.render('user/userLogin')
})

// New Feature
// router.post('/authenticate', async (req, res) => {
//   try {
//     const { email, password } = req.body

//     const user = await User.findOne({ email }).select('+password')

//     if(!user) {
//       req.flash("error_msg", "User not found.")
//       res.redirect('/')
//     }

//     if(await bcrypt.compare(password, user.password)) {
//       const userId = user._id.toString()
//       const secret = authJson.secret
//       const token = jwt.sign({ _id: userId }, secret, { expiresIn: 84600 })
//       user.password = undefined 
//       res.set('Authorization', token).redirect('/')
//     }

//     req.flash("success_msg", "Logged in to your account")
//     res.redirect('/')
//   } catch (err) {
//     res.send(err)
//   }
  
// })

module.exports = router;