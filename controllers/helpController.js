import MakeHelp from "../model/helpModel.js";

export async function makeHelp(req, res) {
    try {
        const {
            user_name, 
            email, 
            vehicle_image, 
            vehicle_no, 
            model, 
            type, 
            color, 
            nic, 
            contact_no, 
            address, 
            latitude, 
            longitude
        } = req.body;

        // Validate required fields
        if (!user_name || !email || !vehicle_no || !latitude || !longitude) {
            return res.status(400).json({
                message: "Missing required fields: user_name, email, vehicle_no, latitude, longitude",
                error: "Validation Error"
            });
        }

        // Validate coordinates
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({
                message: "Invalid coordinates",
                error: "Latitude must be between -90 and 90, longitude must be between -180 and 180"
            });
        }

        // Check if user already has an active help request
        const existingHelp = await MakeHelp.findOne({
            email: email,
            isCancelled: false
        });

        if (existingHelp) {
            return res.status(409).json({
                message: "You already have an active help request",
                existing_help_id: existingHelp._id
            });
        }

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
            address: address,
            latitude: latitude,
            longitude: longitude,
            isCancelled: false,
            createdAt: new Date()
        });

        const results = await help.save();
        
        res.status(201).json({
            message: "Successfully created help request.",
            help_id: results._id,
            results: results
        });

    } catch (error) {
        console.error("Error creating help request:", error);
        res.status(500).json({
            message: "Failed to create help request.",
            error: error.message
        });
    }
}

/*
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
 res.status(500).json({
      message: "Can't be made help.",
      error: e
    });
    }
}

*/

export async function cancellMadeHelp(req, res) {
    try {
        const { make_help_id } = req.body;
        
        if (!make_help_id) {
            return res.status(400).json({
                message: "Help ID is required",
                error: "Validation Error"
            });
        }

        console.log("Cancelling help request:", make_help_id);
        
        const result = await MakeHelp.findByIdAndUpdate(
            make_help_id, 
            { 
                isCancelled: true,
                cancelledAt: new Date()
            }, 
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                message: "Help request not found",
                error: "Not Found"
            });
        }

        res.status(200).json({
            message: "Successfully cancelled the help request.",
            result: result
        });

    } catch (error) {
        console.error("Error cancelling help request:", error);
        res.status(500).json({
            message: "Failed to cancel help request.",
            error: error.message
        });
    }
}

/*
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
*/

export async function getMadeHelps(req, res) {
    try {
        // Get query parameters for filtering
        const { limit = 50, offset = 0, radius, lat, lng } = req.query;
        
        let query = { isCancelled: false };
        
        // Optional: Filter by location radius (in kilometers)
        if (radius && lat && lng) {
            const radiusInRadians = parseFloat(radius) / 6371; // Earth's radius in km
            query.latitude = {
                $gte: parseFloat(lat) - radiusInRadians,
                $lte: parseFloat(lat) + radiusInRadians
            };
            query.longitude = {
                $gte: parseFloat(lng) - radiusInRadians,
                $lte: parseFloat(lng) + radiusInRadians
            };
        }

        const results = await MakeHelp.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(offset))
            .select('-__v'); // Exclude version field

        const totalCount = await MakeHelp.countDocuments(query);

        res.status(200).json({
            message: "Successfully fetched help requests.",
            results: results,
            pagination: {
                total: totalCount,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
            }
        });

    } catch (error) {
        console.error("Error fetching help requests:", error);
        res.status(500).json({
            message: "Failed to fetch help requests.",
            error: error.message
        });
    }
}

/*
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
*/

// New endpoint to get help requests by user email
export async function getUserHelps(req, res) {
    try {
        const { email } = req.params;
        
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                error: "Validation Error"
            });
        }

        const results = await MakeHelp.find({ email: email })
            .sort({ createdAt: -1 })
            .select('-__v');

        res.status(200).json({
            message: "Successfully fetched user help requests.",
            results: results
        });

    } catch (error) {
        console.error("Error fetching user help requests:", error);
        res.status(500).json({
            message: "Failed to fetch user help requests.",
            error: error.message
        });
    }
}

// New endpoint to get help request by ID
export async function getHelpById(req, res) {
    try {
        const { help_id } = req.params;
        
        if (!help_id) {
            return res.status(400).json({
                message: "Help ID is required",
                error: "Validation Error"
            });
        }

        const result = await MakeHelp.findById(help_id).select('-__v');

        if (!result) {
            return res.status(404).json({
                message: "Help request not found",
                error: "Not Found"
            });
        }

        res.status(200).json({
            message: "Successfully fetched help request.",
            result: result
        });

    } catch (error) {
        console.error("Error fetching help request:", error);
        res.status(500).json({
            message: "Failed to fetch help request.",
            error: error.message
        });
    }
}