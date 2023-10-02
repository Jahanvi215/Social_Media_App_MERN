const express = require("express");
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const UserRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")
const cors = require("cors")
const multer = require('multer')
const path = require('path')

dotenv.config(); 

mongoose
  .connect(process.env.MONGO_URL)
  .then( async() => {
    await console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

  app.use("/images/newPost", express.static(path.join(__dirname, "public/images/newPost")));

  //middleware
  app.use(express.json());
  app.use(helmet());
  app.use(morgan("common"));
  app.use(cors());

  const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
      cb(null, "public/images/newPost");
    },
    filename: (req, file, cb) =>{
      // const uniqueImg = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, req.body.name);
    }
  });

  const upload = multer({storage: storage});
  app.post("/api/upload", upload.single("file"), (req,res)=>{
    try{
      return res.status(200).json("File uploaded Successfully")
    }catch(err){
      console.log(err)
    }
  });

  app.use("/api/users", UserRoute)
  app.use("/api/auth", authRoute)
  app.use("/api/posts", postRoute)

  app.get("/", (req,res) =>{
    res.send("welcome to homepage")
  })


app.listen(8800,async() =>{
    await console.log("Server is running on port")
})

//Social123MERN