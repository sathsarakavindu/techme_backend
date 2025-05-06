
import User from "../model/userRegisterModel.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';

export async function getUsers(req, res){

  try{ 
    const { email, password } = req.body;  
    console.log(email, password);  

  const user = await User.findOne({email: email});
  if(!user){
    
   return res.status(400).json({message:'User not found'});
  }

  const isMatch = await bcryptjs.compare(password, user.password);
  
  if(!isMatch){
     return res.status(404).json({message: "Password is incorrect."});
  }

  const token = jwt.sign({ id:user._id }, "passwordKey");
  res.json({ token, ...user._doc});
}
catch(e){
    res.status(500).json({
        error: e.message
    });
}
}
export async function postUser(req, res){

    try{
        const { name, email, password, contact_no, nic, address, account_type} = req.body;
        console.log(name, email , password);
         const existingUser = await User.findOne({ email });
         if(existingUser){
           return res.status(400).json({message: "User already exists"});
         }
         else{
            const hashedPassword = await bcryptjs.hash(password, 8);
            let user = new User({
                name: name,
                email: email,
                password: hashedPassword,
                contact_no: contact_no,
                nic: nic,
                address: address,
                account_type: account_type
            });

          await user.save().
          then((results)=>{
            res.status(200).json({
                message: "User created successfully!",
                result: results
            });
          }).
          catch((error)=>{
            res.status(404).json({
                message: "User can't be created!",
                error: error
            });
          });
           
         }
    
    }
    catch(e){
      res.status(400).json({
      error:e
      });
    }

}   

export async function deleteUser(req, res){

    const deleteValue = req.body;
    console.log(deleteValue.first_name);

    User.deleteOne({
        first_name: deleteValue.first_name
    }).then((result)=>{
        res.json({
            message: "Successfully deleted",
            result: result
        });
    })
    .catch((error)=>{
        res.json({
            message: "Can't be deleted",
            error: error
        });
    });

}   

export async function putUser(req, res){

    const updateValue = req.body;

    User.updateOne({
        first_name: updateValue.first_name
    }).
    then((result)=>{
        res.json({result: result});
    }).
    catch((error)=>{
        res.json({error: error});
    });
}   