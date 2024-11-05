require('dotenv').config()

const express=require('express')
const path=require('path')

const mongoose=require("mongoose")
const userRoute=require('./routes/user')
const blogRoute=require('./routes/blog')
const cookiePaser=require("cookie-parser")
const { checkforauthcookie } = require('./middlewares/authentication')
const Blog = require('./models/blog');
const app=express();

const PORT= process.env.PORT || 8000

app.use(express.json());
// just like above to handle body from a form we use urlencoded ....
app.use(express.urlencoded({ extended: true }));
app.use(cookiePaser())

// mongodb+srv://vamshi:BlogNest@test1.kq0lp.mongodb.net/?retryWrites=true&w=majority&appName=Test1
mongoose.connect(process.env.MONGO_URL || 'mongodb+srv://vamshi:BlogNest@test1.kq0lp.mongodb.net/?retryWrites=true&w=majority&appName=Test1', {
  })
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
  

  
// We generally write like this to But in real word it is not correct to write since when you are 
// Deploying the PORT number ( say 8000  ) may be available or not available on the client side so in real deployment/production we don't do this!
// We handle this by ENV varaibles 

app.set("view engine","ejs")
// This line tells the Express application to use EJS as the templating engine
app.set("views",path.resolve("./views"))
// This line defines the folder where your view templates are stored.

// calls the particular middle ware
// since while signin we are saving with name token hence need to pass the same name
app.use(checkforauthcookie("token"))
app.use(express.static(path.resolve('./public')))
app.get("/", async (req, res) => {
  try {
      const allBlogs = await Blog.find({});
      res.render("home", {
          user: req.user,
          blogs: allBlogs
      });
  } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).render("error", { message: "Failed to load blogs. Please try again later." });
  }
});


app.use('/user',userRoute)
app.use('/blog',blogRoute)
app.listen(PORT, ()=>console.log(`Server started on port ${PORT}!`))

