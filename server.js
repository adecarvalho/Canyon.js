const express=require('express')
const app=express()
const fs=require('fs')
let path=require('path')

app.use(express.static(path.join(__dirname,'public')))

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})

app.listen(8080,()=>{
    console.log("server localhost:8080")
})