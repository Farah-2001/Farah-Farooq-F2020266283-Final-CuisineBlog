const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Review = require("./models/Review");

//parsing data form req.body
app.use(express.urlencoded({ extended: true }));

//static assets
app.use(express.static("public"));

mongoose
  .connect("mongodb://localhost:27017/F2020266283-Final-CuisineBlog")
  .then(() => {
    console.log(`Connected to MongoDB`);
  })
  .catch((err) => {
    console.log(`Oh No ERROR!`);
    console.log(err);
  });
  app.use(methodOverride("_method"));


//view engine
app.set("view engine", "ejs");

// home
app.get("/",async(req,res)=>
{
  if(req.query.category)
  {
    let user={};
    user = {category:req.query.category.split(',')};
    Review.find(user)
    .then(Review=>
    {
      if(!Review)
      {       
        res.send("error occured");
      }
      else
      {  
        console.log(Review);
        res.render("cuisine/category",{Review});
      }
    })
    .catch(err=>
    {   
      res.send("error occured");
    })
  }
  else
  {
    Review.find()
    .then(Review=>
    {
      res.render("home",{Review})
    })
    .catch(()=>
    {
      console.log(`Error`)
    })
  }
});

//search
app.get("/home/:id",async(req,res)=>
{
  if(req.params.id)
  {
    const id = req.params.id;
    Review.findById(id)
    .then(Review=>
    {
      if(!Review)
      {
        console.log(`Error`)
      }
      else
      {
        res.render("cuisine/review",{Review})
      }
     }).catch(err=>{
      console.log(`Error`)
     })
 }
 else{
  console.log(`Error`)
 }
});

//contact route
app.get("/contact", (req, res) => {
  res.render("contact");
});

//show all
app.get("/cuisine", async (req, res) => {
  try {
    const cuisine = await Review.find();
    // console.log(recepies);
    res.render("cuisine/cuisine", { cuisine });
  } catch (error) {
    console.log(`Oh No ERROR!`);
    res.send(error.message);
  }
});

//render create new page
app.get("/review/new", (req, res) => {
  res.render("cuisine/new");
});

//create
app.post("/cuisine", async (req, res) => {
  const { title, text, img, category,author,date } = req.body;

  const review = new Review({
    title,
    text,
    img,
    category,
    author,
    date,
  });
  try {
    await review.save();
    res.redirect("/cuisine");
  } catch (error) {
    console.log(`Oh No ERROR!`);
    res.send(error.message);
  }
});

//show details page
app.get("/cuisine/:id",(req, res) => {
    const id  = req.params.id;
    console.log(req.params);
   Review.findById(id).then(foundReview=>{
    console.log(foundReview);
    res.render("cuisine/review", { foundReview });
   }).catch(err=>{
    console.log(`Oh No ERROR!`);
    res.send(error.message);
   })
});

//edit form
app.get("/cuisine/:id/edit", async (req, res) => {
  const id = req.params.id;
  const foundReview = await Review.findById(id);
  res.render("cuisine/update", { foundReview });
});

//update route
app.post("/cuisine/:id", async (req, res) => 
{
  try {
    const id = req.params.id;
    const foundReview = await Review.findByIdAndUpdate(id, req.body, 
    {
      new: true,
    });
    res.redirect("/cuisine");
  } catch (error) {
    console.log(`Oh No ERROR!`);
    res.send(error.message);
  }
});

//Delete 
app.get("/delete/:id", async (req, res) => 
{
  const id =req.params.id;
   Review.findByIdAndDelete(id).then(users=>
    {
      if(!users){
        res.send("error deleting data");
      }
      else{
        res.redirect("/cuisine");
      }
    })
    .catch(err=>
    {
      console.log(`Oh No ERROR!`);
      res.send(error.message);
    })
});

//Server Host
app.listen(8082, () => {
  console.log("Server Listening at PORT 8082...");
});