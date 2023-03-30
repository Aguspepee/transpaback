const socketio = require('socket.io');
const jwt = require("jsonwebtoken");
const CONFIG = require("../config/config");

module.exports = function (server) {
    const io = socketio(server, {
        cors: {
            origin: `${process.env.FRONTEND_URL}`,
            methods: ["GET", "POST"],
            credentials: true,
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.query.token;

        if (!token) {
            return next(new Error('Authentication error: missing token'));
        }

        jwt.verify(token, CONFIG.SECRET_KEY, (err, decoded) => {
            if (err) {
                return next(new Error('Authentication error: invalid token'));
            }

            socket.decoded = decoded;
            next();
        });
    });

    io.on("connection", (socket) => {
        console.log(`Socket ${socket.id} connected.`);
        socket.on('disconnect', function () {
            console.log(`Socket  ${socket.id} disconnected`);
        });

    });

    return io;
}