const express=require("express")
const app=express()
require("dotenv").config();
const port=process.env.PORT || 3000
const mongoose=require("mongoose")
const path=require("path")
const fileRoutes=require("./routes/files")
const downloadRoutes=require("./routes/download")
const downloadFileRoutes=require("./routes/downloadFile")
const bodyParser=require("body-parser")
const cors=require("cors")

//db connection
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true
}).then(()=>{
    console.log("DB CONNECTED")
}).catch(()=>{
    console.log("error")
})

app.set("views",path.join(__dirname,"/views"))
app.set("view engine","ejs")

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))


app.use("/api/files",fileRoutes)
app.use("/files",downloadRoutes)
app.use("/files/download",downloadFileRoutes)



app.listen(port,()=>{
    console.log("server listening")
})