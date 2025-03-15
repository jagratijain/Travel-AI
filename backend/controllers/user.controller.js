import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

//update uset details
export const updateUser = async (req, res) => {
  
  if (req.user.id !== req.params.id) {
    return res.status(401).send({
      success: false,
      message: "You can only update your own account please login again!",
      
    });
  }
  //   console.log(req.body.phone);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          address: req.body.address,
          phone: req.body.phone,
        },
      },
      { new: true }
    );

    const { password: pass, ...rest } = updatedUser._doc;

    res.status(201).send({
      success: true,
      message: "User Details Updated Successfully",
      user: rest,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(200).send({
        success: true,
        message: "email already taken please login!",
      });
    }
  }
};

//update user profile photo
export const updateProfilePhoto = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(401).send({
        success: false,
        message:
          "You can only update your own account profile photo please login again!",
      });
    }

    const updatedProfilePhoto = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const validUser = await User.findById(req.params.id);
    const { password: pass, ...rest } = validUser._doc;

    if (updatedProfilePhoto) {
      return res.status(201).send({
        success: true,
        message: "Profile photo updated",
        user: rest,
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// update user password
export const updateUserPassword = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(401).send({
        success: false,
        message:
          "You can only update your own account password please login again!",
      });
    }

    const validUser = await User.findById(req.params.id);

    if (!validUser) {
      return res.status(404).send({
        success: false,
        message: "User Not Found!",
      });
    }

    const oldPassword = req.body.oldpassword;
    const newPassword = req.body.newpassword;

    const validPassword = bcryptjs.compareSync(oldPassword, validUser.password);
    if (!validPassword) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }

    const updatedHashedPassword = bcryptjs.hashSync(newPassword, 10);
    const updatedPassword = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          password: updatedHashedPassword,
        },
      },
      { new: true }
    );

    return res.status(201).send({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

//delete user
export const deleteUserAccount = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return res.status(401).send({
      success: false,
      message: "You can only delete your account!",
    });
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token"); //clear cookie before sending json
    res.status(200).send({
      success: true,
      message: "User account has been deleted!",
    });
  } catch (error) {
    console.log(error);
  }
};

//get all users admin
export const getAllUsers = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const users = await User.find({
      user_role: 0,
      $or: [
        { username: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { phone: { $regex: searchTerm, $options: "i" } },
      ],
    });
    if (users && users.length > 0) {
      res.send(users);
    } else {
      res.status(200).send({
        success: false,
        message: "No Users Yet!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//delete user admin
export const deleteUserAccountAdmin = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req?.params?.id);
    res.status(200).send({
      success: true,
      message: "User account has been deleted!",
    });
  } catch (error) {
    console.log(error);
  }
};

export const verifyUser = async (req, res) => {
  try {
    // if (req.user.id !== req.params.id) {
    //   return res.status(401).send({
    //     success: false,
    //     message:
    //       "You can only validate your account, please login again!",
    //       res: {req},
    //   });
    // }

    const { userId, otp } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.otp || !user.otp.code) {
      return res.status(400).json({ success: false, message: 'No OTP found for this user' });
    }

    const now = new Date();
    if (now > user.otp.expiresAt) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    if (otp !== user.otp.code) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { isVerified: true },
        $unset: { otp: "" }
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(500).json({ success: false, message: 'Failed to update user' });
    }
    
    const { password, ...rest } = updatedUser.toObject();
    // res.status(200).json({ success: true, message: 'OTP verified successfully', rest });
    
    res.status(200).json({ success: true, message: 'OTP verified successfully', user: rest });


    // if (!updatedUser) {
    //   return res.status(404).send({
    //     success: false,
    //     message: "User not found",
    //   });
    // }


    // res.status(200).send({
    //   success: true,
    //   message: "User verified successfully",
    //   user: rest,
    // });
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      success: false, 
      message: 'Error verifying OTP', 
      error: error.message 
    });

    // res.status(500).send({
    //   success: false,
    //   message: "Error in user verification",
    //   error,
    // });
  }
};

export const updateOTP = async (req, res) => {
  try {
    const { userId, otp, expiresAt } = req.body;
    const user = await User.findByIdAndUpdate(userId, 
      { 
        $set: {
          'otp.code': otp,
          'otp.expiresAt': new Date(expiresAt)
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'OTP updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating OTP', error: error.message });
  }
};

export const checkOTP = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.otp || !user.otp.code) {
      return res.status(400).json({ success: false, message: 'No OTP found for this user' });
    }

    const now = new Date();
    if (now > user.otp.expiresAt) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    res.status(200).json({ success: true, message: 'OTP is valid' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error checking OTP', error: error.message });
  }
};

export const checkUserExists = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({
        success: true,
        message: "User found",
        user:user,
        exists: true,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "User not found",
        exists: false,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error checking user existence",
      error: error.message,
    });
  }
};

