import { Customer,DeliveryPartner } from "../../models/user.js";
import jwt from "jsonwebtoken";

const generateTokens = (user)=>{


    const accessToken = jwt.sign(
        {userId: user._id, role : user.role},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : "1d"}

    );

    const refreshToken = jwt.sign(
        {userId: user._id, role : user.role},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn : "1d"}
 
    );
    return {refreshToken,accessToken}
};


export const loginCustomer = async(req,reply)=>{
    try {
        const  {phone} = req.body;
        let customer = await Customer.findOne({phone});

        if(!customer){
            customer = new Customer({
                phone,
                role:"Customer",
                isActivated: true,
            })
            await customer.save();
        }

        const {accessToken,refreshToken}= generateTokens(customer);
        
        return reply.send({
          message : customer ? "Login Successfully " : "Customer created and logged in",
          accessToken,
          refreshToken,
          customer,
        })
    } catch (error) {

        return reply.status(500).send({message : "an error accoured in login",error})
        
    }
};


export const loginDeliveryPartner  = async(req,reply)=>{
    try {
        const  {email,password} = req.body;
        let deliveryPartner = await  DeliveryPartner.findOne({email});

        if(!deliveryPartner){
          return reply
          .status(404)
          .send({message : "Delivery partner not found",error})
        }

        const isMatch = password === deliveryPartner.password;

        if(!isMatach){
            return reply
            .status(400)
            .send({message : "Invalid cradentials"})
        }


        const {accessToken,refreshToken}= generateTokens(deliveryPartner);
        
        return reply.send({
          message : "Login Successfully ",
          accessToken,
          refreshToken,
          deliveryPartner,
        })
    } catch (error) {

        return reply.status(500).send({message : "an error accoured in login",error})
        
    }
}

export const refreshToken = async(req,reply)=>{

    const {refreshToken} = req.body;
    if(!refreshToken){
        return reply.status(401).send({message:"refresh token required"})
    }
    try {
        const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);

        let user;
        if(decoded.role === "Customer"){
            user = await Customer.findById(decoded.userId);
        }else if(decoded.role === "DeliveryPartner"){
            user = await DeliveryPartner.findById(decoded.userId);

        }else{
            return reply.status(403).send({message:"invalid role"})
        }

        if(!user){
            return reply
            .status(403)
            .message("invalid refresh token")
        }

        const {accessToken,refreshToken:newRefreshToken}= generateTokens(user);
        return reply.send({
            message:"Token",
            accessToken,
            refreshToken:newRefreshToken
        })
        
    } catch (error) {
       return reply
       .status(403)
       .send({message:"invalid refresh token"}) 
    }

}

export const fetchUser = async (req,reply)=>{
    try {
        const {userId,role} = req.body;
        let user;

        if(decoded.role === "Customer"){
            user = await Customer.findById(decoded.userId);
        }else if(decoded.role === "DeliveryPartner"){
            user = await DeliveryPartner.findById(decoded.userId);

        }else{
            return reply.status(403).send({message:"invalid role"})
        }

        if(!user){
            return reply
            .status(403)
            .message("invalid refresh token")
        }



    } catch (error) {
        return reply
        .status(500)
        .send({message:"an error accoured",error})
    }
}