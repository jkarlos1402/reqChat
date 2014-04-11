/*
 * 
 * declaración del servidor, 8090 es el puerto.
 * 
 * Nota: el puerto es el asignado por el administrador del servidor
 */
var servidorChat = require("socket.io").listen(8090);

/*
 * Array en el que se almacenan los usuarios del chat, tanto usuarios que
 * atienden peticiones, como usuarios que hacen peticiones
 */
var nicknames = new Array();

var contadorAgenteTemp = 0;

/*
 * evento que se ejecuta al realizarse una conexión
 */
servidorChat.sockets.on("connection", function(socket) {
    /*
     * nuevoAgente es el nombre del evento creado para manejar una nueva 
     * conexion al servidor de chat
     */
    socket.on("nuevoAgente", function(agente) {
        var indexNick = 0;
        for (indexNick = 0; indexNick < nicknames.length; indexNick++) {
            if (nicknames[indexNick].nickname === agente) {
                console.log("Agente existente");
                if (agente.indexOf('&agente&') !== -1) {
                    console.log("Asignando listener");
                    nicknames[indexNick].atendiendo = "";
                    console.log("Listener asignado");
                    emitir(socket, "Bienvenido, en espera de un usuario...", "mensajeLogin");
                } else {
                    emitir(socket, "Bienvenido, espere un momento por favor...", "mensajeLogin");
                    console.log("buscando agente que lo atienda");
                    contadorAgenteTemp = 0;
                    for (agenteTemp = 0; agenteTemp < nicknames.length; agenteTemp++) {
                        if (nicknames[agenteTemp].nickname.indexOf("&agente&") !== -1) {
                            if (nicknames[agenteTemp].atendiendo === "") {
                                nicknames[agenteTemp].atendiendo = socket;
                                nicknames[indexNick].atendiendo = nicknames[agenteTemp];
                                console.log("Agente encontrado, lo atiende " + agenteTemp);
                                emitir(socket, "Bienvenido, gracias por la espera, lo atiende " + nicknames[agenteTemp].nickname.substring(8, nicknames[agenteTemp].nickname.lenght), "mensajeLogin");
                                emitir(nicknames[agenteTemp], "usuarioEntrante" + agente, "mensajeLogin");
                                break;
                            }
                        }
                        contadorAgenteTemp++;
                    }
                    if (contadorAgenteTemp === nicknames.length) {
                        emitir(socket, "Por el momento no estamos disponibles, intentelo más tarde... <br/><br/><a href='javascript:iniciarSesion();'>Reintentar</a>", "mensajeLogin");
                        console.log("Por el momento no estamos disponibles, intentelo más tarde... ");
                    }
                }
                break;
            }
        }
        console.log("indexNick tiene: " + indexNick);
        if (indexNick === nicknames.length) {
            socket.nickname = agente;
            console.log('Se agrego el agente ' + socket.nickname);
            if (agente.indexOf('&agente&') !== -1) {
                console.log("el usuario es un agente administrador");
                console.log("Asignando listener");
                socket.atendiendo = "";
                console.log("Listener asignado");
                emitir(socket, "Bienvenido, en espera de un usuario...", "mensajeLogin");
            } else {
                contadorAgenteTemp = 0;
                for (agenteTemp = 0; agenteTemp < nicknames.length; agenteTemp++) {
                    if (nicknames[agenteTemp].nickname.indexOf("&agente&") !== -1) {
                        if (nicknames[agenteTemp].atendiendo === "") {
                            socket.atendiendo = nicknames[agenteTemp];
                            nicknames[agenteTemp].atendiendo = socket;
                            console.log("Agente encontrado, lo atiende " + nicknames[agenteTemp].nickname);
                            emitir(socket, "Bienvenido, gracias por la espera, lo atiende " + nicknames[agenteTemp].nickname.substring(8, nicknames[agenteTemp].nickname.lenght), "mensajeLogin");
                            emitir(nicknames[agenteTemp], "usuarioEntrante" + agente, "mensajeLogin");
                            break;
                        }
                    }
                    contadorAgenteTemp++;
                }
                if (contadorAgenteTemp === nicknames.length) {
                    emitir(socket, "Por el momento no estamos disponibles, intentelo más tarde... <br/><br/><a href='javascript:iniciarSesion();'>Reintentar</a>", "mensajeLogin");
                    console.log("Por el momento no estamos disponibles, intentelo más tarde...");
                }
            }
            nicknames.push(socket);
        }
        console.log("hay " + nicknames.length + " agentes");
    });

    /*
     * mensajeChat es el nombre del evento creado para la emision de un mensaje 
     * una vez que se haya establecido la conexión entre dos usuarios
     */
    socket.on("mensajeChat", function(data) {
        emitir(socket.atendiendo, data, 'mensajeChat');
    });
       
    /*
     * evento propio de socket io que permite manipular los datos cuando un 
     * usuario se desconecta, ya sea por evento controlado, por recarga de la 
     * página o por cierre de la misma.
     */
    socket.on('disconnect', function(){
       console.log("se salio usuario");
        if (socket.nickname && socket.nickname.indexOf("&agente&") === -1){
            if(socket.atendiendo !== ""){
                emitir(socket.atendiendo, "terminarChat", "mensajeExit");
            }
            if (socket.atendiendo !== "") {
                var indexNick = 0;
                for (indexNick = 0; indexNick < nicknames.length; indexNick++) {
                    if (nicknames[indexNick].atendiendo.nickname === socket.nickname){
                        break;
                    }
                }
                if(indexNick < nicknames.length){
                    nicknames[indexNick].atendiendo = "";
                }
                indexNick = 0;
                for (indexNick = 0; indexNick < nicknames.length; indexNick++) {
                    if (nicknames[indexNick].nickname === socket.nickname){
                        break;
                    }
                }
                if(indexNick < nicknames.length){
                    nicknames.splice(indexNick,1);
                }
            }else{
                indexNick = 0;
                for (indexNick = 0; indexNick < nicknames.length; indexNick++) {
                    if (nicknames[indexNick].nickname === socket.nickname){
                        break;
                    }
                }
                if(indexNick < nicknames.length){
                    nicknames.splice(indexNick,1);
                }
            }         
        }else{
            if(socket.nickname){
                if(socket.atendiendo !== ""){
                    emitir(socket.atendiendo, "redirigir", "mensajeExit");
                }
                indexNick = 0;
                for (indexNick = 0; indexNick < nicknames.length; indexNick++) {
                    if (nicknames[indexNick].nickname === socket.nickname){
                        break;
                    }
                }
                if(indexNick < nicknames.length){
                    nicknames.splice(indexNick,1);
                } 
            }            
        }         
    });
});

/*
 * funcion que permite la emision de mensajes entre el servidor y el cliente,
 * recibe como parámetros el o los usuarios a los que se hara la emisión, 
 * el mensaje a emitir y el tipo de mensaje a emitit
 */
function emitir(agentes, data, tipo){
    console.log(tipo);
    if (tipo === "mensajeLogin"){
        agentes.emit(tipo, data);
    }else if(tipo === "mensajeChat"){
        agentes.emit(tipo, data);
    }else if(tipo === "mensajeExit"){
        agentes.emit(tipo,data);
    }

}