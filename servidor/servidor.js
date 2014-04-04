var servidorChat = require("socket.io").listen(8090);
var nicknames = {};

var contadorAgenteTemp = 0;

servidorChat.sockets.on("connection",function(socket){
    socket.on("nuevoAgente",function(agente,callback){
        if(agente in nicknames ){
            console.log("El agente ya existe");
            if(agente.indexOf('&agente&')!== -1){
                console.log("Asignando listener");
                nicknames[agente]['atendiendo'] = "";
                console.log("Listener asignado");
            }else{
                console.log("buscando agente que lo atienda");                
                contadorAgenteTemp = 0;
                for(var agenteTemp in nicknames){
                    if(agenteTemp.indexOf("&agente&")!== -1){
                        if(nicknames[agenteTemp]['atendiendo'] === ""){
                            nicknames[agenteTemp]['atendiendo'] = agente;
                            nicknames[agente]['atendiendo'] = agenteTemp;
                            console.log("Agente encontrado, lo atiende "+ agenteTemp);                            
                            break;
                        }
                    }
                    contadorAgenteTemp++;
                } 
                if(contadorAgenteTemp === Object.getOwnPropertyNames(nicknames).length){
                    console.log("Por el momento no hay hay agentes que lo atiendan, intentelo mas tarde");
                }
            }          
        }else{
            socket.nickname =  agente;
            nicknames[socket.nickname] = socket;
            console.log('Se agrego el agente '+socket.nickname);
            if(agente.indexOf('&agente&')!== -1){
                console.log("el usuario es un agente administrador");
                console.log("Asignando listener");
                nicknames[socket.nickname]['atendiendo'] = "";
                console.log("Listener asignado");
            }else{
                console.log("buscando agente que lo atienda");                
                contadorAgenteTemp = 0;
                for(var agenteTemp in nicknames){
                    if(agenteTemp.indexOf("&agente&")!== -1){
                        if(nicknames[agenteTemp]['atendiendo'] === ""){
                            nicknames[agenteTemp]['atendiendo'] = agente;
                            nicknames[agente]['atendiendo'] = agenteTemp;
                            console.log("Agente encontrado, lo atiende "+ agenteTemp);                            
                            break;
                        }
                    }
                    contadorAgenteTemp++;
                } 
                if(contadorAgenteTemp === Object.getOwnPropertyNames(nicknames).length){
                    console.log("Por el momento no hay hay agentes que lo atiendan, intentelo mas tarde");
                }                               
            }
        }   
    });
    socket.on("mensajeChat",function(data){        
        emitir(nicknames[nicknames[socket.nickname]["atendiendo"]],data,'');        
    });
});

function emitir(agentes,data,tipo){
    if(tipo === "logIn"){
        
    }else if(tipo === "mensaje"){
        
    }
    agentes.emit("mensajeDesdeServidor",data);
}

