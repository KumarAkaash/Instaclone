const express=require('express')
const app=express()
const mongoose=require('mongoose');
const PORT=process.env.PORT ||8080;
require("dotenv").config();
const path=require("path")
// const cors = require('cors');

const fileupload = require('express-fileupload'); 

app.use(fileupload({useTempFiles: true}))

// const allowedOrigins = ['http://localhost:3000']
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }))




require('./model/user')
require('./model/post')
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))

app.use(express.static("build"))
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"))
})

const mongo = process.env.MONGO_URI
mongoose.connect(mongo)



app.listen(PORT, () => {
  console.log(`sun rha hu ${PORT} pe`);
});


//database:admin:7eXjAqR0Z6rksFqH