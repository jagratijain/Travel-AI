import express from "express";
import {
  deleteUserAccount,
  deleteUserAccountAdmin,
  getAllUsers,
  updateProfilePhoto,
  updateUser,
  updateUserPassword,
  verifyUser,
  updateOTP,
  checkOTP,
  checkUserExists
} from "../controllers/user.controller.js";
import { isAdmin, requireSignIn, otpVerified} from "../middlewares/authMiddleware.js";

const router = express.Router();

// check user exist
router.post('/check-user', checkUserExists);

//user auth
router.get("/user-auth", requireSignIn, (req, res) => {
  return res.status(200).send({ check: true });
});

// otp validated
router.get("/verify-user", requireSignIn, otpVerified,(req, res) => {
  res.status(200).send({ check: true });
});

// router.post('/verify/:id', requireSignIn, verifyUser);

router.post('/update-otp', updateOTP);

router.get('/check-otp/:userId', requireSignIn, checkOTP);
router.post('/verify-otp', requireSignIn, verifyUser);

//admin auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ check: true });
});

//update user details
router.post("/update/:id", requireSignIn, updateUser);

//update user profile photo
router.post("/update-profile-photo/:id", requireSignIn, updateProfilePhoto);

//update user password
router.post("/update-password/:id", requireSignIn, updateUserPassword);

//delete user account
router.delete("/delete/:id", requireSignIn, deleteUserAccount);

//get all users
router.get("/getAllUsers", requireSignIn, isAdmin, getAllUsers);

//admin delete user accounts
router.delete(
  "/delete-user/:id",
  requireSignIn,
  isAdmin,
  deleteUserAccountAdmin
);

export default router;
