const express = require("express");
const connectDb=require('../backend/config/Db');
const userRoutes=require('./Routes/userRoutes');
const accountRouter=require('./Routes/AccountRoutes')
const cors=require("cors")


const app=express();
connectDb();
app.use(
  cors({
    origin: "https://paytm-frontend-liard-chi.vercel.app", // Your deployed frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json()); 
// 
app.get('/', (req, res) => {
  res.send('Hello');
});


app.use('/api/users',userRoutes)

app.use('/api/account',accountRouter)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





