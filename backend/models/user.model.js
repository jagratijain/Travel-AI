import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/mern-travel-tourism.appspot.com/o/profile-photos%2F1706415975072defaultProfileImgttms125.png?alt=media&token=7f309b9e-7ccf-4a15-ba5c-829c9952a85c",
    },
    user_role: {
      type: Number,
      default: 0,
    },
    otp: {
      code: {
        type: String,
        default: null
      },
      expiresAt: {
        type: Date,
        default: null
      }
    },
    isVerified: {
      type: Boolean,
      default: false
    }    
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
