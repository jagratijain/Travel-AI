import express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import packageRoute from "./routes/package.route.js";
import ratingRoute from "./routes/rating.route.js";
import bookingRoute from "./routes/booking.route.js";
import insightsRoute from "./routes/ai-insights.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import cors from 'cors';
import { Resend } from 'resend';


const app = express();
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors({
  origin: ['https://travelbugg.vercel.app', 'http://localhost:5173'],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',

}));

const __dirname = path.resolve();

mongoose
  .connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/package", packageRoute);
app.use("/api/rating", ratingRoute);
app.use("/api/booking", bookingRoute);
app.use('/api/ai-insights', insightsRoute);

app.get("/", (req, res) => {
  res.send("TravelBug API is running");
});

// Route for sending email

app.post('/send-email', async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    const { data, error } = await resend.emails.send({
      from: "developers@buildfolio.in",
      to: [to],
      subject,
      html,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    res.status(200).json({ data });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export default app;
