var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride =  require('method-override');


//Let us first connect to the Mongo DB 
mongoose.connect('mongodb://127.0.0.1:27017/BlogSite_app', {useNewUrlParser: true, useUnifiedTopology: true,  useFindAndModify: false });
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"))
app.set("view-engine","ejs");

//The mongoose schema will have 4 variables-
//title //image //body-Strings //created-date
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default:Date.now}
});
//Modelling the blog into given Schema
var Blog = mongoose.model("Blog", blogSchema);

//Let us Create a sample blog
/*Blog.create({
    title: "Test Blog",
    image: "https://images.unsplash.com/photo-1588325935601-9352032828e1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    body: "Work from Home is a mess. Believe me. I can't take any further"
});*/


//RESTFUL ROUTING
//INDEX ROUTE - To show all blogs
app.get("/blogs", function(req, res){
    Blog.find({},function(err, blogs){
        if(err){
            console.log("ERROR");
        }
        else{
            res.render("index.ejs", {blogs:blogs});
        }
    });
});


//NEW ROUTE - To create a new Route
app.get("/blogs/new",function(req, res){
    res.render("new.ejs");
});


//CREATE ROUTE - To add new Blog Post to our Index
app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new.ejs");
        }
        else{
            res.redirect("/blogs");
        }
    })
});

//SHOW ROUTE- This will be used to read more information about the blog
app.get("/blogs/:id",function(req, res){
    Blog.findById(req.params.id,function(err, foundPost){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show.ejs", {blog: foundPost});
        }
    })
});


//EDIT Route- This Route will be used to edit the pre-existing blogs
app.get("/blogs/:id/edit", function(req, res)
{
    Blog.findById(req.params.id,function(err, foundPost){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit.ejs",{blog:foundPost});
        }
    })
});

//UPDATE ROUTE - This Route is used to Update the edited Blog into the previously existing blog
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
        if(err){
            res.render("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
});


//DESTROY ROUTE- To Delete the unwanted Post
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    })
});

//Making Sure to return error on making unknown requests
app.get("*", function(req, res){
    res.send("Error 404.............You might have made an unknown request");
});


//Listening to the Requests
app.listen(2702 , function(){
    console.log("The Server has Started");
});

