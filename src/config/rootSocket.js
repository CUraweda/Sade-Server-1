const rootSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('New connection');
        socket.on('join-room', (room) => {
            console.log('join room for', room);
            socket.join(room);
        });
        socket.on('cc', () => {
            console.log('JIDASGYDAUHIJ')
            io.emit('cc_refresh')
        })
        socket.on('disconnect', () => {
            console.log('disconnected');
            console.log(socket.rooms.size);
        });
    });
    return io;
};
module.exports = rootSocket;