const express = require('express')
const mongoose = require('mongoose')
require("dotenv").config()
const cors = require('cors')
const passport = require('passport')
const morgan = require('morgan')
const {v4: uuidv4} = require('uuid')
const fs = require('fs')
const path = require('path')



const router = require("./routes/route")

const app = express()
app.use(express.json())
app.use(cors())
app.use("/",router)


//margan logger config
morgan.token("id",function getId(req){
    return req.id
})

morgan.token("param",function(req,res,param){
    return "userToken"
})

app.use(assignId)

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'),{flags:'a'})


app.use(morgan(':id :method :url :status "HTTP/:version"'))
app.use(morgan(':id :method :url :status "HTTP/:version"',{stream:accessLogStream}))
app.use(hello)

function hello(req, res, next) {
    console.log("hello")
}

function assignId(req,res,next){
    req.id = uuidv4()
    next()
}

//passport middleware
app.use(passport.initialize())

//passport configuration
require("./config/passport")(passport)


mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true})
.then(() => {
    console.log('Connected to mongodb')
    app.listen(process.env.PORT||4000,()=>{
        console.log("Express running on port",process.env.PORT||4000)
    })
})
.catch((err)=>{
    console.log(err)
})