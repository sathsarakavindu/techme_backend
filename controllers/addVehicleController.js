import express from "express";
import Vehicle from "../model/vehicleModel.js";

export async function addVehicle(req, res){

  try{
    const image_url = req.body.image_url;
    const vehicle_no = req.body.vehicle_no;
    const vehicle_type = req.body.type;
    const vehicle_model = req.body.model;
    const vehicle_color = req.body.color;

    console.log(image_url);
    console.log(vehicle_no);
    console.log(vehicle_type);
    console.log(vehicle_model);
    console.log(vehicle_color);  

const addVehicel = new Vehicle({
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

export function getVehicles(req, res){

}

export function updateVehicle(req, res){

}

export function deleteVehicle(req, res){   

}