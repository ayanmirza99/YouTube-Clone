import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(async (req, res) => {
  // get user information from frontend
  const { email, fullName, username, password } = req.body;

  // validation - not empty
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user already exists - email or username
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  // check for images and check avatar
  const localAvatarPath = req.files?.avatar[0]?.path;
  const localCoverImagePath = req.files?.coverImage[0]?.path;
  if (!localAvatarPath) {
    throw new ApiError(400, "Avatar is required");
  }

  // upload them on cloudinary
  const avatar = await uploadOnCloudinary(localAvatarPath);
  const coverImage = await uploadOnCloudinary(localCoverImagePath);
  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  // create user object - in db
  const user = await User.create({
    fullName,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
  });

  // check if user created in db and remove password and refresh token field from response
  const createdUser = await User.findOne(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});
