import ApprovalHelp from "../model/approvalModel.js";

export async function approvalHelp(req, res){

    try{

        const{help_id, technician_name, technician_email, technician_contact_no, technician_nic, technician_address, user_name, user_email, user_contact_no, user_nic, user_address, vehicle_name, vehicle_image_url, vehicle_no, vehicle_model, vehicle_type, vehicle_color} = req.body;
    
   const saveApprovalInfo = await ApprovalHelp({
    help_id: help_id,
    technician_name: technician_name,
    technician_email: technician_email,
    technician_contact_no: technician_contact_no,
    technician_nic: technician_nic,
    technician_address: technician_address,
    user_name: user_name,
    user_email: user_email,
    user_contact_no: user_contact_no,
    user_nic: user_nic,
    user_address: user_address,
    vehicle_name: vehicle_name,
    vehicle_image_url: vehicle_image_url,
    vehicle_no: vehicle_no,
    vehicle_model: vehicle_model,
    vehicle_type: vehicle_type,
    vehicle_color: vehicle_color
   });

   await saveApprovalInfo.save().then((results)=>{  
    res.status(200).json({
        message: "Approval information saved successfully",
        result: results 

    });
    })
    .catch((error)=>{
        res.status(400).json({
            message: "Approval information can't be saved",
            error: error
        });
    });
}
catch(e){
    res.status(400).json({
        message: "Error occurred while saving approval information",
        error: e
    });
}
}

export async function removeApprovalHelp(req, res){
    try{
        const {help_id} = req.body;
        await ApprovalHelp.findOneAndDelete({help_id: help_id}).
        then((results)=>{
            res.status(200).json({
                message: "Approval help successully removed!",
                results: results
            });
        }).
        catch((error)=>{
            res.status(200).json({
                message: "Approval help can't be removed!",
                error: error
            });
        });
    }
    catch(e){
res.status(200).json({
                message: "Something went wrong in removing approval help",
                error: error
            });
    }
}