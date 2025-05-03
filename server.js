const express = require('express');
const dotenv =require ('dotenv');
const morgan=require ('morgan');
const authRoutes = require("./server/routes/AuthRoutes");
const categoryRoutes = require('./server/routes/CategoryRoutes');
const productRoutes = require('./server/routes/ProductRoutes');
const cors = require('cors');


dotenv.config({path:'config.env'});
const ConnectDB=require('./server/database/db');
ConnectDB();



const app = express();
app.use(express.json());


const PORT= process.env.PORT||8080

app.use(morgan('tiny'))
app.use(cors({
  origin: 'http://localhost:3001', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));
app.use('/uploads', express.static('uploads'));

app.get('/',(req,res)=>{
    res.json({message:"crud Application"});

})
app.use("/api/auth", authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

app.use((req, res) => {
    res.status(404).json({
      message: `Route non trouvée: ${req.originalUrl}`
    });
  });
  

app.listen(PORT,()=> {
    console.log(`server is running on http://localhost:${PORT}`);
});