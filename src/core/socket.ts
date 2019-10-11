import socket from 'socket.io';
import http from 'http';


export default (http: http.Server) => {


const io = socket(http);

io.on("connection", function(socket: any) {

    /*const rooms = [];
    socket.on("CREATE:ROOMS", (room_1: any) => {
        socket.join(room_1);
        console.log(room_1);
    })*/

    socket.on("DIALOGS:JOIN", (dialogId: string) => {
        socket.dialogId = dialogId;
        socket.join(dialogId);
        console.log("JOIN", dialogId, socket, http);
    })
    socket.on('DIALOGS:TYPING', (obj: any) => {
        socket
        //.to(obj.dialogId)
        .emit('DIALOGS:TYPING', obj);
        console.log(obj);
    })
    console.log(socket);
    });

    return io;
}

