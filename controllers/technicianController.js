import Technician from "../model/technicianRegisterModel.js";
import bcryptjs from "bcryptjs";

export async function postTechnical(req, res){

    try{
        const {name, email, password, contact_no, nic, address, account_type} = req.body;

         const excistingTech = await Technician.findOne({email: email});
         if(excistingTech){
          return res.status(400).json({message: "You have already an account!"});
         }
else{
    const hashedPassword = await bcryptjs.hash(password, 8);
    let technician = await Technician({
              "name": name,
              "email": email,
              "password": hashedPassword,
              "contact_no": contact_no,
              "nic": nic,
              "address": address,
              "account_type": account_type
    });

    await technician.save();
    res.status(200).json({
        message: "Technician account successfully created!",
        name: name,
        email: email,
        contact_no: contact_no,
        nic: nic,
        address: address,
        account_type: account_type
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

export async function getTechnician(){


}

export async function putTechnician(){


}

export async function deleteTechnician(){

}