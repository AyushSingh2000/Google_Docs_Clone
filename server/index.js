const express = require ("express");
const mongoose=require('mongoose');
const cors=require('cors');
const http = require("http");
const authRouter = require('./routes/auth');
const PORT=process.env.PORT |3001;
const documentRouter = require("./routes/document");
const Document = require("./models/document");



const app=express();
var server = http.createServer(app);
var io = require("socket.io")(server);

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});
app.use(authRouter);
app.use(documentRouter);



const DB="mongodb+srv://awesomeayushawesome:test123@cluster0.l310j39.mongodb.net/?retryWrites=true&w=majority";



mongoose.connect(DB).then(()=>{
console.log('Connection successful');
}).catch((err)=>{
console.log(err);
});

io.on("connection", (socket) => {
  socket.on('join', (documentId) => {
    socket.join(documentId);
    console.log("joined");
  });

  socket.on("typing", (data) => {
      socket.broadcast.to(data.room).emit("changes", data);
    });
   socket.on("save", (data) => {
      saveData(data);
    });
 });

const saveData = async (data) => {
  let document = await Document.findOneAndUpdate({_id: data.room}, {content: data.delta});

};
server.listen(PORT,"0.0.0.0", ()=>{
console.log(`connected at ${PORT}`);
console.log("hey this is changing");
});


