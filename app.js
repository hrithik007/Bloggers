var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
 passport = require("passport"),
 localstrategy = require("passport-local"),
 user = require("./models/user"), 
    express = require("express"),
    app = express();
const mongoose = require('./database/mongoose');
// mongoose.connect("mongodb://localhost/blog");  

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//===================
//PASSPORT CONFIG
//==============
// app.use(require("express-session")({

// }))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//==========================================
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});
var Blog = mongoose.model("Blog", blogSchema);
// Blog.create({
//   title: "Text",
//   image: "https://media.techeblog.com/images/hr-porsche-911-syberia-rs.jpg",
//   body: "BODYY",
// });


//==========================================
// RESTFUL ROUTES
//=======================================


app.get("/", function (req, res) {
    res.redirect("/blogs");
});


// app.get("/blog", function(req, res){
//     res.send("Blog page");
// })



//INDEX ROUTE \\ datas
app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("ERROR!");
        } else {
            //console.log(blogs);
            res.render("index", {blogs: blogs, currentuser: req.user});
        }
    });
});

// // NEW ROUTE
app.get("/blogs/5ea4a2962bd4745bdcac41c0/new", function (req, res) {
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function (req, res) {
    // create blog
    console.log(req.body);
    console.log("===========")
    console.log(req.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            res.render("new");
        } else {
            //then, redirect to the index
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } 
        if (foundBlog.id != "5ea4a2962bd4745bdcac41c0"){
            res.render("show2", {blog: foundBlog});
        }
        else {
            res.render("show", { blog: foundBlog });
        }
    })
});

//Show 2
// SHOW ROUTE
app.get("/blogs/", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show2", { blog: foundBlog });
        }
    })
});




// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("update", {blog: foundBlog});
        }
    });
})


//Update Route

app.put("/blogs/:id", function (req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, update) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//DELETE ROUTE

app.delete("/blogs/:id", function(req, res) {
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       }else{
           res.redirect("/blogs");
       }
   })
})


//



//Register
app.get("/register", function (req, res) {
    res.render("register");
});
//Sign Up

app.post("/register", function (req, res) {
    var newuser = new user({ username: req.body.username });
    user.register(newuser, req.body.password, function (err, user) {
        if (err) {
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function (req, res) {
            res.redirect("/blogs");
            //    if(user.newuser=="hhh@gmail.com") {
            //    res.redirect("/blog");
            //    }
            //    else {
            //    res.redirect("/blogs");
            // }
        })
    })
})

//Login

app.get("/login", function (req, res) {
    res.render("login");
})
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/blogs",
        failureRedirect: "/login"
    }), function (req, res) {
    });
//logout

app.get("/logout", function (req, res) {
    req.logOut();
    res.redirect("/blogs");
})




//



//module.exports = Blog;
const Port = process.env.Port || 27017;
app.listen(Port, () => console.log("Server Connected!"));


