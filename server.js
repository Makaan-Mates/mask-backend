const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const secretKeyForAuthentication = 'Mask@_#1045718'
const mongoose = require('mongoose')
app.use(express.json())
// Connecting to mongodb...
mongoose.connect('mongodb+srv://rathoursourabh45:Mask%40%5F%231045718@cluster0.px2olez.mongodb.net/users')

// Copied from stack overflow - checking the connection to the database
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("once", (error, response) => {
  console.log(response);
});

// Schema banane ke prakriya
const User = mongoose.model('User',{
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type:String,
    },
    password: {
        type: String,
    }
    

})

const verifyToken = (req,res,next)=>{
const authHeaders = req.headers.authorization;
const token = authHeaders && authHeaders.split(" ")[1]

if(token===null) return res.status(404).send('Not authorized')

jwt.verify(token,secretKeyForAuthentication,(err,decoded)=>{
    if(err){
        res.status(404).send("Not authorized")
    } else {
        res.send("authorized")
        req.user = decoded
        next()
    }
})
}

app.get('/api/home' , verifyToken, (req,res)=>{
    console.log(req.user)
    res.json({
        key: "hello"
    })
})

app.post('/register', async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    const newUser = await User({
        email:email,
        username:username,
        password:password
    })  

    const savedUser = await newUser.save()

    res.status(201).send("account created")

})

app.post('/signin', async (req,res)=>{
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({email:email})

  if(user===null){
    res.status(404).send("account not found")
    return
  }

  try {
    if(await user.password===password){
        const token = jwt.sign({email:email}, secretKeyForAuthentication)
        res.status(200).json({
            token:token
        })

    }
    else {
        res.send("wrong password bro")
    }

  } catch {
    res.status(500).send()
  }


})

app.listen(4000 ,()=>{
    console.log("server started...")
})