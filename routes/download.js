const express=require('express')
const router=express.Router()
const File=require('../models/file')
require("dotenv").config();
router.get("/:uuid",async (req,res)=>{
    try {
        const file=await File.findOne({uuid:req.params.uuid})
        if(!file){
        return res.render("download",{error:"file not found"})
        }

        return res.render("download",{
            uuid:file.uuid,
            fileName:file.filename,
            fileSize:file.size, 
            downloadLink:`${process.env.BASE_URL}/files/download/${file.uuid}`
        })
    }
    catch(err) {
        return res.render("download",{error:err.message})
    }
})



module.exports=router