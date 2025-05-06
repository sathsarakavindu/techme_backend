import Technician from "../model/technicianRegisterModel.js";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

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

export async function putTechnician(){


}

export async function deleteTechnician(){

}