var websocket;
$(document).ready(iniciar);
function iniciar() {
    /*
     * Al cargar la página se realiza la conexión al servidor
     */
    websocket = io.connect("http://192.168.1.103:8090");
    
    /*
     * se establecen los listener para cada tipo de mensaje recibido
     */
    websocket.on("mensajeChat", recibirMensaje);
    websocket.on("mensajeLogin", recibirLogIn);
    websocket.on("mensajeExit", recibirExit);
    
    /*
     * se crean los listener para enviar mensajes desde el cliente al servidor
     */
    $("#formulario").on("click", iniciarSesion);
    $("#enviarMsg").on("click", enviarMensaje);
    $("#botonLogInChat").button({icons: {primary: "ui-icon-comment"}}).unbind("click").on("click", logInChat);
    $("#botonEnviarMensaje").button({icons: {primary: "ui-icon-comment"}}).unbind("click").on("click", enviarMensaje);
    
    /*
     * si existe una session valida se procede al inicio de sesion en el 
     * servidor de chat
     */
    if ($("#sesion").val() !== "") {
        iniciarSesion();
    }
   
    /*
     * iniciar los elementos del dom
     */
    $('#mensajeChat').keyup(function(e) {
        if (e.keyCode === 13) {
            enviarMensaje();
        }
    });   
    $("#nicknameChatTemp").keyup(function(e) {
        if (e.keyCode === 13) {
            logInChat();
        }
    });   
    $(document).tooltip();
    $("#logChat").perfectScrollbar({suppressScrollX: true, wheelPropagation: true});
}

/*
 * funcion que válida los datos de entrada para iniciar sesion en el chat
 */
function logInChat() {
    if ($.trim($("#nicknameChatTemp").val()) !== "") {
        $("#nicknameChat").val($("#nicknameChatTemp").val())
        $("#nicknameChatTemp").removeClass("ui-state-error");
        $("#logInChat").append("<div id='progressbar' style='width: 90%; height: 20px; text-align: center; margin: auto;'><div class='progress-label' style='position: absolute; color: #FFFFFF; font-weight: bold; margin-top:3px;'>Ingresando...</div></div>");
        $("#logInChat div:first").hide();
        $("#progressbar").progressbar({value: false});
        iniciarSesion();
    } else {
        $("#nicknameChatTemp").addClass("ui-state-error");
        return false;
    }
}

/*
 * funcion que emite al servidor la peticion de un nuevo usuario con los datos 
 * necesarios
 */
function iniciarSesion() {
    if ($("#sesion").val() !== '') {
        websocket.emit("nuevoAgente", $("#sesion").val());
    } else {
        websocket.emit("nuevoAgente", $("#nicknameChat").val());
    }
}

/*
 * emite el mensaje escrito por el usuario al servidor
 */
function enviarMensaje() {
    if ($.trim($("#mensajeChat").val()) !== "") {
        websocket.emit("mensajeChat", $("#mensajeChat").val());
        recibirMensaje($("#mensajeChat").val());
        $("#mensajeChat").val("").focus();
    }
}

/*
 * recibe los mensajes que le envia el servidor y los presenta al usuario
 */
function recibirMensaje(datosServidor) {
    $("#contenidoChat").append("<tr><td><b>usuario1:</b> " + datosServidor + "<td><tr>");
    $("#logChat").perfectScrollbar("update");
    var elem = $("#logChat");
    var maxScrollTop = elem[0].scrollHeight - elem.outerHeight();
    if (maxScrollTop > 0) {
        $("#logChat").scrollTop(maxScrollTop);
    }
}

/*
 * recibe los mensajes enviados por el servidor donde se indica el resultado de
 * la peticion de inicio de sesión
 */
function recibirLogIn(datos) {
    $("#logInChat").fadeOut(500, function() {
        $("#progressbar").progressbar("destroy");
        $("#progressbar").remove();
        $("#logInChat").html(datos).show("drop", 600, function() {
            if (datos.indexOf("lo atiende") !== -1) {
                $("#logInChat").position({
                    of: "#divChat",
                    my: "left top",
                    at: "left top",
                    collision: "none none"
                });
                $("#logInChat").next("div").show("drop", 500);
            } else if (datos.indexOf("usuarioEntrante") !== -1) {
                $("#logInChat").html("Atendiendo al usuario " + datos.substring(15, datos.lenght)).position({
                    of: "#divChat",
                    my: "left top",
                    at: "left top",
                    collision: "none none"
                });
                $("#logInChat").next("div").show("drop", 500);
            }
        });
    });
}

/*
 * recibe los mensajes que le envia el servidor relacionados con el abandono del 
 * chat por el usuario con el que se tenía comunicación
 */
function recibirExit(datos){
    if(datos === "terminarChat"){
        $("#contenidoChat").html("");
        $("#logInChat").next("div").hide("drop",500,function(){
            $("#logInChat").html("<p><b>El usuario abandon\u00f3 el chat...</b></p>");
            setTimeout(function(){
                iniciarSesion();
            },1000);            
        });
    }else if(datos === "redirigir"){
        $("#logInChat").next("div").hide("drop",500,function(){
            $("#logInChat").html("<p><b>Sentimos las molestas, se perdi\u00f3 la comunicaci\u00f3n, estamos en busca de un nuevo agente que lo atienda, espere por favor...</b></p>");
            setTimeout(function(){
                iniciarSesion();
            },4000);            
        });
    }
}
