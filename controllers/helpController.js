import MakeHelp from "../model/helpModel.js";

export async function makeHelp(req, res){

    try{

    const {user_name, email, vehicle_image, vehicle_no, model, type, color, nic, contact_no, address, latitude, longitude} = req.body;

    let help = new MakeHelp({

    user_name: user_name,
    email: email,
    vehicle_image: vehicle_image,
    vehicle_no: vehicle_no,
    model: model,
    type: type,
    color: color,
    nic: nic,
    contact_no: contact_no,
    address:address,
    latitude:latitude,
    longitude:longitude,
     });

     await help.save().
     then((results)=>{
        res.status(200).json({
            message: "Successfully made help.",
            results: results
        });
     }).
     catch((error)=>{
        res.status(500).json({
             message: "Can't be made help.",
            error: error
        });
     });

    }
    catch(e){

    }
}

export async function cancellMadeHelp(req, res){

    try{
    const {make_help_id} = req.body;
         console.log(make_help_id);
       await MakeHelp.findByIdAndUpdate(make_help_id, {isCancelled: true}, {new: true})
        .then((result)=>{
            res.status(200).json({
                message: "Successfully cancelled the help.",
                result: result
            });
        });

    }
    catch(e){
       res.status(500).json({
            message: "Can't be cancelled the help.",
            error: e
        });
    }
    

}

export async function getMadeHelps(req, res){
          try{

            
            await MakeHelp.find({isCancelled: false}).sort({createdAt: -1})
            .then((results)=>{
                res.status(200).json({
                    message: "Successfully fetched helps.",
                    results: results
                });
            })
          }
          catch(e){
              res.status(500).json({
                  message: "Can't be fetched helps.",
                  error: e
              });
          }
}
