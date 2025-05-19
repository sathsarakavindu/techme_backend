import Technician from "../model/technicianRegisterModel.js";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcryptjs from "bcryptjs";
import nodemailer from 'nodemailer';

dotenv.config();

export async function postTechnical(req, res){

    try{
        const {name, email, password, contact_no, nic, address, account_type} = req.body;

         const excistingTech = await Technician.findOne({email: email});
         if(excistingTech){
          return res.status(400).json({message: "You have already an account!"});
         }
else{
    const hashedPassword =  bcrypt.hashSync(password, 8);
    let technician = await Technician({
              "name": name,
              "email": email,
              "password": hashedPassword,
              "contact_no": contact_no,
              "nic": nic,
              "address": address,
              "account_type": account_type
    });

    await technician.save().then((result)=>{
        console.log(result);
        res.status(200).json({
            message: "Technician account successfully created!",
            result: result
        });
    }).catch((err)=>{
        console.log(err);
        res.status(400).json({
            message: "Technician account data can't be saved!",
            error: err
        });
    });
     }
  }

catch(e){
  res.status(400).json({
    message: "Technician account can't be created!",
    error: e
});
}
}

export async function signInTechnician(req, res){

  try{
    const secret_key = process.env.SECRET_KEY;
    const {email, password} = req.body;
    
     await Technician.findOne({email: email}).
    then((result)=>{
      if(result != null){

        const payload = {
          name: result.name,
          email: result.email,
          contact_no: result.contact_no,
          nic: result.nic,
          address: result.address,
          account_type: result.account_type,
        };
        
        const isPasswordValid = bcrypt.compareSync(password, result.password);
        if(isPasswordValid){
         const token = jwt.sign(payload, secret_key, { expiresIn: "10h"});
         return   res.status(200).json({
            message: "Successfully Login!", 
            result: result,
            token: token,
          });
        }
        else{
          
          console.log("Password is invalid");
          return res.status(404).json({message: "Email or password is incorrect",  error:e.toString()});
        }
      }
      else{
       return res.status(404).json({message: "Email or password is incorrect", error:e.toString()});
      }
    }).
    catch((e)=>{
      res.status(404).json({message: "Can't be found", error: e.toString()});
    });
   
  }
  catch(e){
    res.status(404).json({message: "Can't be login", error: e.toString()});
  }

}

export async function changePasswordTechnician(req, res){
    try{
           const { user_email, current_password, new_password} = req.body;
            await Technician.findOne({ email: user_email}).then(async (results)=>{
if(results != null){
    const isMatch = await bcryptjs.compare(current_password, results.password);

    if(isMatch){
        const hashedPassword = await bcryptjs.hash(new_password, 8);
    await Technician.updateOne({password: hashedPassword}).
        then((results)=>{
    res.status(200).json({
        message: "Password changed successfully",
        result: results
    });
        }).catch((error)=>{
          res.status(400).json({
          message: "Password can't be changed",
          error: error
        });
      });
    }
    else{
        console.log("Incorrect password");
        res.status(400).json({
            message: "Incorrect password",
            result: results
        });
    }
}
else{
    console.log("Incorrect password");
res.status(400).json({
    message: "Incorrect password",
    result: results
});
}

            }).catch((err)=>{
res.status(500).json({message: "change password error", error: err.toString()});
            });

    }
    catch(e){

    }
}


export async function sentOTPToTechnician(req, res){

  const {registered_email} = req.body;

  try{

  await Technician.findOne({email: registered_email}).
  then((user)=>{
       if(user != null){
console.log(`User is found: ${user}`);
      const transporter = nodemailer.createTransport({
      service: "gmail",  
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
             user: process.env.SERVICE_EMAIL,
             pass: process.env.SERVICE_EMAIL_PASSWORD,
            },
      });
     const otp = Math.floor(1000 + Math.random() * 9000);
       const message = {
                   from: process.env.EMAIL,
                   to: registered_email,
                   subject: "Validate OTP",
                   text: "Your OTP code is " + otp
          }

       transporter.sendMail(message, (err, info)=>{

      if(err){
        console.log(err);
      }
      else{
        console.log(info);

        Technician.findOneAndUpdate({email: registered_email}, {otp: otp}, {new: true}).
        then((result)=>{
          res.status(200).json({
            message: "OTP sent successfully",
            result: result
          });
        }).
        catch((error)=>{
          res.status(400).json({
            message: "OTP can't be sent",
            error: error
          });
        });

      }
    });


       }
       else{
        res.status(400).json({message: "Invalid Email"});
       }

  });

    }
  catch(e){
    console.log(`OTP sending error is ${e.toString()}`);
      res.status(500).json({
        message: "OTP can't be sent!",
        error: e.toString()
      });
  }

}

export async function checkOTPValidationForTechnician(req, res){

    try{
         const {sent_otp} = req.body;
        //  const hashedPassword = await bcryptjs.hash(new_password, 8);

         await Technician.findOne({otp: sent_otp}).
       then((results)=>{
           if(results != null){
               res.status(200).json({
               message: "OTP is correct!"
               });
           }
           else{
              res.status(400).json({
               message: "OTP is incorrect!"
               });
           }
       })

    }
    catch(e){

    }
}

export async function forgotPasswordUpdateForTechnician(req, res){

     try{
            const {new_password, otp} = req.body;
            const hashedPassword = await bcryptjs.hash(new_password, 8);
           await Technician.findOneAndUpdate({otp: otp}, {password: hashedPassword}, {new: true}).
            then((results)=>{
              
                res.status(200).json({
                    message: "Technician Password updated successfully",
                    result: results
                });
            }).
            catch((error)=>{
                res.status(400).json({
                    message: "Password can't be updated",
                    error: error
                });
            });
     }
     catch(e){

     }

}
