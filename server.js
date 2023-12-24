const express = require('express')
const app = express()

app.get('/mask/api' , (req,res)=>{
    res.send("Done")
})

app.listen(4000 ,()=>{
    console.log("server started...")
})