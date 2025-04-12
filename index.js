import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import cors from "cors";
import postRoutes from "./routes/post.route.js";
dotenv.config();


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.use("/auth", authRoutes);
app.use("/post", postRoutes);



app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
