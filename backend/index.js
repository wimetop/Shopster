import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";
import cors from "cors"
import dns from "node:dns/promises";
import productRouter from "./routes/product.js";
import authRouter from "./routes/user.js";
import categoryRouter from "./routes/category.js";
import cartRouter from "./routes/cart.js";
import orderRouter from "./routes/order.js";
import reviewRouter from "./routes/review.js";
import userRouter from "./routes/users.js";

dns.setServers(["1.1.1.1", "1.0.0.1"]);


const app = express();

app.use(express.json());   
app.use(cors());

dotenv.config();
const port = process.env.PORT
const mongo_url = process.env.MONGODB_URL


app.use('/api/products',productRouter)
app.use('/api/auth', authRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', orderRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/users', userRouter)






const connectDB = async () => 
    {
        try
        {
            await mongoose.connect(mongo_url)
            console.log("Database connected")
        }  
        catch(error)
        {
            console.log(error)
        }
    }


app.listen(port,()=>
    {
        connectDB()
        console.log(`Server is running on ${port} port`)
    })
