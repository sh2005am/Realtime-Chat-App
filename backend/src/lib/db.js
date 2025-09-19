import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }
    catch (error) {
        console.log("error connecting mongo DB", error)
    }
}
export default connectDb;