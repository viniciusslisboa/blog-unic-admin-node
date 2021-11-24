const express = require("express");
const router = express.Router();
const Categories = require("../database/models/Category");
const Posts = require("../database/models/Post");
const User = require('../database/models/User')
const verifyJwt = require('../middlewares/authenticate')
/* ============CATEGORY============ */

// route list the categories
router.get("/category", verifyJwt, async (req, res) => {
  try {
   const categs = await Categories.find().sort({ createdAt: "desc" });
   res.render("admin/category", { categ: categs });
  } catch (err) {
     req.flash("error_msg", "Error list the categories");
     res.redirect("/admin");
  }
  
});

// route form add category
router.get("/category/add", verifyJwt, (req, res) => {
  res.render("admin/addCategory");
});

// route save the category in database
router.post("/category/new", async (req, res) => {
  var err = [];

  if (
   !req.body.name ||
   typeof req.body.name == undefined ||
   req.body.name == null
  ) {
   err.push({ err: "Invalid Name" });
   res.status(400);
  }
  if (
   !req.body.slug ||
   typeof req.body.slug == undefined ||
   req.body.slug == null
  ) {
   err.push({ err: "Invalid Slug" });
   res.status(400);
  }
  if (req.body.name.length < 2) {
   err.push({ err: "category name is too small" });
   res.status(400);
  }
  if (err.length > 0) {
   res.render("admin/addCategory", { err: err });
   res.status(400);
  } else {
   const newCategory = {
     name: req.body.name,
     slug: req.body.slug,
   };
   try {
     await Categories.create(newCategory).then(() => {
      req.flash("success_msg", "Category saved with success");
      res.redirect("/admin/category");
     });
   } catch (err) {
     req.flash("error_msg", "Error saving category");
     res.redirect("/admin/category");
   }
  }
});

// route edit category
router.get("/category/edit/:id", verifyJwt, async (req, res) => {
  try {
   const editCateg = await Categories.findOne({ _id: req.params.id });
   res.render("admin/editCategory", { categ: editCateg });
  } catch (err) {
    req.flash("error_msg", "Category do not exists");
    res.redirect("/admin/category");
  }
});

// route form edit category
router.post("/category/edit", async (req, res) => {
  var err = [];

  try {
   if (
     !req.body.name ||
     typeof req.body.name == undefined ||
     req.body.name == null
   ) {
     err.push({ err: "Invalid Name" });
     res.status(400);
   }
   if (
     !req.body.slug ||
     typeof req.body.slug == undefined ||
     req.body.slug == null
   ) {
     err.push({ err: "Invalid Slug" });
     res.status(400);
   }
   if (req.body.name.length < 2) {
     err.push({ err: "category name is too small" });
     res.status(400);
   }
   if (err.length > 0) {
     res.render("admin/editCategory", { err: err });
   } else {
     await Categories.findOne({ _id: req.body.id }).then((categs) => {
      categs.name = req.body.name;
      categs.slug = req.body.slug;
      categs.save().then(() => {
        req.flash("success_msg", "Category Updated");
        res.redirect("/admin/category");
      });
     });
   }
  } catch (err) {
   req.flash("error_msg", "Category cannot be saved ");
   res.redirect("/admin/category",  { err: err });
  }
});

// route delete the category
router.post("/category/delete", async (req, res) => {
  try {
   const id = await req.body.id;
   await Categories.deleteOne({ _id: id }).then(() => {
     req.flash("warning_msg", "Category removed whith success");
     res.redirect("/admin/category");
   });
  } catch (err) {
   req.flash("error_msg", "Can't remove the category");
   res.redirect("/admin/category");
  }
}); 

/* ============POSTS============ */

// route list the posts
router.get("/posts",verifyJwt, async (req, res) => {
  try{
   const posts = await Posts.find({}).populate("category").sort({ createdAt: "desc"})
   res.render("admin/posts", { post: posts })
  } catch (err) {
     res.send(err)
  }
});

// route form add post
router.get("/posts/add",verifyJwt, async (req, res) => {
  const categs = await Categories.find().sort({ createdAt: "desc" });
  res.render("admin/addPost", { categ: categs })
})

// route save the post in database
router.post("/posts/new", async (req, res) => {
  var err = [];

  if (!req.body.title || typeof req.body.title == undefined || req.body.title == null) {
   err.push({ err: "Invalid Title" });
   res.status(400);
  }
  if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
   err.push({ err: "Invalid Slug" });
   res.status(400);
  }
  if (!req.body.content || typeof req.body.content == undefined || req.body.content == null) {
   err.push({ err: "Invalid content" });
   res.status(400);
  }
  if (!req.body.description || typeof req.body.description == undefined || req.body.description == null) {
   err.push({ err: "Invalid Description" });
   res.status(400);
  }
  if (err.length > 0) {
   res.render("admin/addPost", { err: err });
   res.status(400);
  } else {
	try {
		const newPost = new Posts({
		title: req.body.title,
		slug: req.body.slug,
		content: req.body.content,
		description: req.body.description,
		category: req.body.categories
		})
    
		await Posts.create(newPost)
		req.flash("success_msg", "Post saved whith success")
		res.redirect('/admin/posts')
	} catch (err) {
		req.flash("error_msg", "Post save falied")
		res.redirect('/admin/posts')
	}
  }
   
   
})

// route delete the posts
router.post('/posts/delete', async (req, res) => {
    try{
        const id = await req.body.id
        await Posts.deleteOne({ _id: id })
        req.flash("warning_msg", "Post deleted with success")
        res.redirect('/admin/posts')
    } catch (err) {
        req.flash("error_msg", "Can't remove the post");
        res.redirect("/admin/posts");
    }
    

})

// route form edit post
router.post('/posts/edit', async (req, res) => {
    var err = [];

        if (!req.body.title || typeof req.body.title == undefined || req.body.title == null) { 
            err.push({ err: "Invalid title" });
            res.status(400);
        }
        if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
            err.push({ err: "Invalid Slug" });
            res.status(400);
        }
        if (!req.body.content || typeof req.body.content == undefined || req.body.content == null) {
            err.push({ err: "Invalid Content" });
            res.status(400);
        }
        if (!req.body.description || typeof req.body.description == undefined || req.body.description == null) {
            err.push({ err: "Invalid Description" });
            res.status(400);
        }
        if (err.length > 0) {
            res.render("admin/editPost", { err: err });

        } else {
            try {
                await Posts.findOne({ _id: req.body.id }).then((post) => {
                    post.title = req.body.title;
                    post.slug = req.body.slug;
                    post.content = req.body.content
                    post.description = req.body.description
                    post.category = req.body.categories
                    post.save().then(() => {
                        req.flash("success_msg", "Post Updated");
                        res.redirect("/admin/posts");
                    });
                });
            } catch (err) {
                req.flash("error_msg", "Post can't be saved ");
                res.redirect("/admin/posts", { err: err });
            }
        }
})

// route edit category
router.get('/posts/edit/:id',verifyJwt, async (req, res) => {
    try {
        const categs = await Categories.find().sort({ createdAt: "desc" });
        const editPost = await Posts.findOne({ _id: req.params.id })
        res.render('admin/editPost', {post: editPost, categ: categs})
    } catch (err) {
        req.flash("error_msg", "Post do not exists");
        res.redirect("/admin/posts");
    }
    
})

/* ============Users============ */

router.get('/users', verifyJwt, async (req, res) => {
  const users = await User.find().select('+password').sort({createdAt: "desc"})
  res.render("admin/usersList", {user: users})
})

module.exports = router;
