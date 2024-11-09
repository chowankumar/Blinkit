import { Customer,DeliveryPartner } from "../../models";
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