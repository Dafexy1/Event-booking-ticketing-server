import dotenv from "dotenv";
dotenv.config();
import app from "./eventCore";
// import connectDB from "./database/database";
import { connectSql } from "./database/sequelize";


// this is incase the use of mongodb
// connectDB()

// this for postgres
connectSql()




const PORT: number = parseInt(process.env.PORT || "5000", 10);
// Root route handler
app.get('/', (req, res) => {
  res.send('Event-Booking server up and running');
});

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});