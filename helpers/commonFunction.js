const nodemailer = require("nodemailer");
const fs = require("fs");
const { log } = require("console");

function sendResetPasswordMail(num, email, callback) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });
    var mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "Code for reset password",
      html: " Hi <strong>" + `${email}` + "</strong> <br /><br /> Your verification code is <strong>" + `${num}` + "</strong>. <br /> Enter this code in our app to reset your password.",
      //text:`${num}`,
    };
    return transporter.sendMail(mailOptions, callback)
}

function fsReadAndWrite (path,data){
    let dataArray = [];
    if (!fs.existsSync(path)) {
        fs.openSync(path, 'w');
        dataArray.push(data);
    }else{
        dataArray = JSON.parse(fs.readFileSync(path))
        dataArray.push(data);
    }
    fs.writeFileSync( path, JSON.stringify(dataArray, null, 2), "utf8" )
}

function fsGetData (path){
    return dataArray = JSON.parse(fs.readFileSync(path))
}

function fsSingleDataById(path, id){
    arr = JSON.parse(fs.readFileSync(path))
    var data = arr.find(el => el._id === id);
    return data;
}

function fsRemoveRecord (path, id){
    let dataArray = [];
    arr = JSON.parse(fs.readFileSync(path))
    var index = arr.findIndex(el => el._id === id);
    if (index > -1) {
        arr.splice(index, 1);
    }
    dataArray = arr;
    fs.writeFileSync( path, JSON.stringify(dataArray, null, 2), "utf8" )
}

module.exports = {
    fsReadAndWrite,
    fsGetData,
    fsSingleDataById,
    fsRemoveRecord,
    sendResetPasswordMail,
}