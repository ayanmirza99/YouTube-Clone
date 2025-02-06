import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
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
router.route("/updateAvatar").post(
  verifyJwt,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  updateUserAvatar
);
router.route("/updateCoverImage").post(
  verifyJwt,
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  updateUserCoverImage
);

export default router;
