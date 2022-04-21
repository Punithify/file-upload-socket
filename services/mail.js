const mail=require("nodemailer")

const sendMail=async ({from,to,subject,text,html})=>{
    console.log(to)
    const transporter=mail.createTransport({
        host :process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        secure:false,
        auth:{
            user:process.env.SMTP_EMAIL,
            pass:process.env.SMTP_PASS
        }
    })

    const info=await transporter.sendMail({
        from:from,
        to:to,
        subject:subject,
        text:text,
        html:html
    })    
    if(info){
       console.log("success") 
    }
}

module.exports={sendMail}