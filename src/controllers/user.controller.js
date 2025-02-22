import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
 const {email,password,fullName,username} = req.body;


 if(
    [email,password,fullName,username].some((fields)=>fields?.trim()=== "")
 ){
throw new ApiError(400,"All fields are required")
 }
 const exitedUser = await User.findOne({
    $or:[{username,email}]
 })
 if(exitedUser){
    throw new ApiError(409,"User with username or email already exits")
    
 }
 const avatarLocalPath = req.files?.avatar[0]?.path
 const coverImageLocalPath = req.files?.coverImage[0]?.path

 if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file  is required ");
    
 }
 const avatar = await uploadOnCloudinary(avatarLocalPath)
 const coverImage = await uploadOnCloudinary(coverImageLocalPath)
if(!avatar){
    throw new ApiError(400,"Avatar file is required ");
}

const user = await User.create({
    email,
    password,
    fullName,
    username,
    avatar: avatar.url,
    coverImage: coverImage?.url || ""
})
const createdUser = await User.findById(user._id).select("-password -refreshToken")
if(!createdUser){
    throw new ApiError(500,"something went wrong while registering the user");
    
}
return res.status(200).json(new ApiResponse(200,createdUser,"user created successfully"))
} )


export {
    registerUser,
}