const express=require('express')
const router=express.Router()
const multer=require('multer')
const path=require('path')
const File=require('../models/file')
const {v4:uuid4}=require('uuid')
const {sendMail}=require("../services/mail")

const storage=multer.diskStorage({
    destination:(req,file,cb)=>
        cb(null,"uploads/"),
    filename:(req,file,cb)=>{       //generate unique filename
        const uniqueName=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`
        cb(null,uniqueName) 
    }
})

const upload=multer({
    storage,
    limit:{fileSize:1000000*1000}
}).single("myfile")

router.post("/",(req,res)=>{
   
    //store file
    upload(req,res,async(error)=>{
        //validate request
        // console.log(req.file)
        if(!req.file){
            return res.json({error:"all fields are required"})
        }
        
        if(error){
            res.status(500).json({error:error.message})
        }
        //store in db
        const file=new File({
            filename:req.file.filename,
            uuid:uuid4(),
            path:req.file.path,
            size:req.file.size
        })
        const response= await file.save()
        return res.json({file:`${process.env.BASE_URL}/files/${response.uuid}`}) //download psge link


    })
})

router.post("/send",async(req,res)=>{
    const{uuid,emailFrom,emailTo}=req.body
    if(!uuid||!emailTo||!emailFrom){
        return res.status(403).json({error:"all fields are required"})
    }
    const file =await File.findOne({uuid:uuid})
    if(file.sender){
        return res.status(403).json({error:"email already sent"})

    }
    file.sender=emailFrom
    file.receiver=emailTo

    const response=await file.save()
    
    sendMail({
        from:emailFrom,
        to:emailTo,
        subject:"unvernisable.tech sharing",
        text:`${emailFrom} has shared a file with you`,
        html:require("../services/emailTemplate")({
            emailFrom:emailFrom,
            downloadLink:`${process.env.BASE_URL}/files/download/${file.uuid}`,
            size:parseInt(file.size/1000+"KB"),
            expires:"expires in 24 hours"
        })
    })
    res.json({success: true})
    //send email

})



module.exports=router