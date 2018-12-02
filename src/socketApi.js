const socketio = require("socket.io");
const io = socketio();
const socketAuthorization = require("../middleware/socketAuthorization");

const socketApi = {
  io: io
};

// libs
const Users = require("./lib/Users");
const Rooms = require("./lib/Rooms");
const Messages = require("./lib/Messages");

// Socket authorization
io.use(socketAuthorization);

/**
 * Redis adapter
 *
 */

const redisAdapter = require("socket.io-redis");
io.adapter(
  redisAdapter({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT
  })
);

io.on("connection", socket => {
  console.log("a user logeed in with name " + socket.request.user._id);
  //socket.broadcast.emit("hello");

  Rooms.list(rooms => {
    io.emit("roomList", rooms);
  });

  Users.upsert(socket.id, socket.request.user);

  Users.list(users => {
    //console.log(users);
    io.emit("onlineList", users);
  });

  socket.on("newMessage", data => {
    console.log(data);
    const messageData = {
      ...data,
      userId: socket.request.user._id,
      username: socket.request.user.name,
      surname: socket.request.user.surname
    };
    Messages.upsert(messageData);

    socket.broadcast.emit("receiveMessage",messageData)
  });

  socket.on("newRoom", roomName => {
    Rooms.upsert(roomName);

    Rooms.list(rooms => {
      io.emit("roomList", rooms);
    });
  });

  socket.on("disconnect", () => {
    Users.remove(socket.request.user._id);

    Users.list(users => {
      //console.log(users);
      io.emit("onlineList", users);
    });
  });
});

module.exports = socketApi;
