var express=require("express");
var bodyParse=require("body-parser");
var expressSanitizer=require("express-sanitizer");
var mongoose=require("mongoose");
var methodover=require("method-override");
var app=express();

mongoose.connect("mongodb://localhost/blog_post");
app.use(bodyParse(true));
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(methodover("_method"));


var blogSchema=mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created: {type:Date , default:Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);

app.get("/",function(req,res){
	res.redirect("/blog");
});

app.get("/blog",function(req,res){
	Blog.find({},function(err,blog){
		if(err)
		{
			res.render("new.ejs");
		}
		else
		{
			res.render("index.ejs", {blog:blog});
		}
	});
});

app.get("/blog/new",function(req,res){
	res.render("new.ejs");
});

app.post("/blog",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err,newBlog){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.redirect("/blog");
		}
	});
});

app.get("/blog/:id",function(req,res){
	Blog.findById(req.params.id,function(err,findBlog){
		if(err)
		{
			res.redirect("/blog");
		}
		else
		{
			res.render("show.ejs",{blog:findBlog});
		}
	});
	
});

app.get("/blog/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,findBlog){
		if(err)
		{
			res.redirect("/blog");
		}
		else
		{
			res.render("edit.ejs",{blog:findBlog});
		}
	});
});

app.put("/blog/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findOneAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
		if(err)
		{
			res.redirect("/blog");
		}
		else
		{
			res.redirect("/blog/"+req.params.id);
		}
	});
});

app.delete("/blog/:id",function(req,res){
	Blog.findOneAndDelete(req.params.id,function(err){
		if(err)
		{
			res.redirect("/blog");
		}
		else
		{
			res.redirect("/blog");
		}
	});
});

app.listen(3000,function(){
	console.log("Blog server has started");
});