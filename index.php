<?php session_start();
    $_SESSION['usuarioAgente'] = "&agente&Maria";
?>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title></title>
        <script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
        <script src="http://192.168.100.200:8090/socket.io/socket.io.js"></script>
    </head>    
    <script>
        var websocket;
        $(document).ready(iniciar);
        function iniciar(){
            websocket = io.connect("http://192.168.100.200:8090");
            websocket.on("mensajeDesdeServidor",recibirMensaje);
            websocket.on("mensajeLogIn",recibirLogIn);
            $("#formulario").on("click",iniciarSesion);
            $("#enviarMsg").on("click",enviarMensaje);
        }
        function iniciarSesion(){            
            if($("#sesion").val() !== ''){              
                websocket.emit("nuevoAgente",$("#sesion").val());
            }else{
                websocket.emit("nuevoAgente",$("#nombre").val());
            }
            $("#nombre").prev("label:first").fadeOut();
            $("#nombre").fadeOut();
            $("#formulario").fadeOut();
        }
        function enviarMensaje(){
            if($("#mensajeChat").val() !== ""){
                websocket.emit("mensajeChat",$("#mensajeChat").val());
            }else{
                alert("Ingrese un mensaje a enviar");
            }
        }
        function recibirMensaje(datosServidor){
            $("#logChat").append("<tr><td><b>usuario1:</b> "+datosServidor+"<td><tr>");            
        }
        function recibirLogIn(datos){
            $("#nick").text(datos);
        }
    </script>
    <body>
        <input type="hidden" id="sesion" value=""/>
        
            <label>Cu&aacute;l es tu nombre?</label>
            <input type="text" id="nombre"/>
            <button id="formulario">Enviar</button>
            <div style="border: solid 1px #5550f8; border-radius: 10px; width: 200px; height: 400px;">
                <table id="logChat" style="width: 100%">                    
                </table>
            </div>
            <input type="text" id="mensajeChat"/><button id="enviarMsg">Enviar</button>
        <label id="nick"></label>
    </body>
</html>
