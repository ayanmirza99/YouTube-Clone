import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);
// secured routes - after auth
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/change-password").post(verifyJwt, changeCurrentPassword);
router.route("/refreshToken").post(refreshAccessToken);
router.route("/getUser").post(verifyJwt, getCurrentUser);
router.route("/updateUser").post(verifyJwt, updateAccountDetails);

export default router;
