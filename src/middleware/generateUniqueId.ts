import { nanoid } from 'nanoid'
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();




export const generateTicketQueueId = async (len: number = 8) => nanoid(len) //=> "V1StGXR8_Z5jdHi6B-myT"
export const generateTicketID = async (len: number = 6) => nanoid(len) //=> "V2StGXR8_Z5jdHi6B-&7G"


export const generateOTP = async (len: number = 6) => {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < len; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};



export const generateAuthToken = ({ id,_id, email}: any) =>
  jwt.sign({ id, _id, email}, process.env.JWT_SECRET ?? '', {
//    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export default generateAuthToken;