import MakeHelp from "../model/helpModel.js";

export async function makeHelp(req, res){

    try{

        const {user_name, email, nic, contact_no, address, latitude, longitude} = req.body;

      let help = new MakeHelp({

    user_name: user_name,
    email: email,
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

