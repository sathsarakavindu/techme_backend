import express from "express";
import Vehicle from "../model/vehicleModel.js";

export async function addVehicle(req, res){

  try{
    const name = req.body.name;
    const email = req.body.email;
    const contact_no = req.body.contact_no;
    const nic = req.body.nic;
    const image_url = req.body.image_url;
    const vehicle_no = req.body.vehicle_no;
    const vehicle_type = req.body.type;
    const vehicle_model = req.body.model;
    const vehicle_color = req.body.color;

    console.log(name);
    console.log(email);
    console.log(contact_no);
    console.log(nic);
    console.log(image_url);
    console.log(vehicle_no);
    console.log(vehicle_type);
    console.log(vehicle_model);
    console.log(vehicle_color);  

const addVehicel = new Vehicle({
    name: name,
    email: email,
    contact_no: contact_no,
    nic: nic,
    image_url: image_url,
    vehicle_no: vehicle_no,
    type: vehicle_type,
    model: vehicle_model,
    color: vehicle_color
});

await addVehicel.save()
.then((resulsts)=>{
    res.status(200).json({
        message: "Vehicle successfully added",
        results: resulsts
    });
})
.catch((err)=>{
    res.status(404).json({
        error: err,
    });
});

}
  catch(e){
    res.status(404).json({
        message: "Vehicle can't be added.",
        error: err,
    });
  }

}

export async function getVehicles(req, res){

    try{
       const nic = req.query.nic;
console.log(nic);
       await Vehicle.find({nic: nic}).
       then(async (results)=>{
        if(results != null){
              res.status(200).json({
               message: "Successfully founded vehicle.",
               result: results
              });
        }
        else{
            res.json({
               message: "No vehicles founded vehicle.",
               result: results
              });
        }
       }).
       catch((error)=>{
        res.status(500).json({
            message: "Vehicle can't be founded.",
            error: error
        });
       });

}
catch(e){


}

}

export async function updateVehicle(req, res){

try{
    const {_id, vehicle_no, type, model, color} = req.body;
    console.log(_id);
    console.log(vehicle_no);
    console.log(type);
    console.log(model);
    
   const updatedVehicle = await Vehicle.findByIdAndUpdate(_id,{
        vehicle_no, 
        type, 
        model, 
        color
    },{new:true});

    console.log("Updated vehicle is ", updateVehicle);

    res.status(200).json({message:"Vehicle updated", result: updatedVehicle});

}
catch(error){
console.log("Error in updateVehicle: ", error);
}



}

export async function deleteVehicle(req, res){   

    try{

        const vehicleNo = req.query.vehicle_no;
        await Vehicle.findOneAndDelete({vehicle_no:vehicleNo}).then((result) => {
if(result){
    res.status(200).json({message:"Vehicle was Deleted Successfully!", result:result});
}
else{
    res.status(404).json({message:"No vehicle found."})
}
        }).catch((error) => {
     res.status(404).json({error:error});
        });

    }
    catch(error){
       console.log(`The error is in deleteVehicle: ${error}`);
    }
}

export async function isAvailableThisVehicle(req, res){

    try{
const vehicleNo = req.query.vehicle_no;
await Vehicle.findOne({vehicle_no: vehicleNo}).then( async (result)=>{
if(result != null){
res.status(200).json({
message:"This vehicle has already been registered!",
result:result
});
}else{
    res.json({message:""})
}

}).catch((error)=>{

    res.status(404).json({message:"This vehicle can't be found"})
});
    }
    catch(error){
 console.log(`The error is in isAvailableThisVehicle: ${error}`);
    }
}