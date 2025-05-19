const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const routes = require("./routes/index");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const db = require("./Utils/dbConfig");
const socketIo = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketIo(server);

app.set("view engine", "ejs");
app.set("io", io);

var sessionOptions = {
  secret: process.env.SESSION_KEY || "Twitter-Clone",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
};

app.use(session(sessionOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploads/tweetImg",
  express.static(path.join(__dirname, "uploads/tweetImg"))
);
app.use(
  "/uploads/avatar",
  express.static(path.join(__dirname, "uploads/avatar"))
);
app.use(cookieParser());
app.use(flash());


app.use("/twitter-clone", routes);

// Socket Connection
io.on("connection", (socket) => {
  console.log("User connected with ID :- ", socket.id);
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server Running On http://localhost:${port}`);
});
