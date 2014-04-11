<?php
session_start();
$_SESSION['usuarioAgente'] = "&agente&Maria";
$sesion = "";
if (isset($_SESSION['usuarioAgente']) && $_SESSION['usuarioAgente'] != "") {
    $sesion = $_SESSION['usuarioAgente'];
}
?>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title></title>
        <script src="js/jquery.js"></script>
        <script src="http://192.168.1.103:8090/socket.io/socket.io.js"></script>
        <script src="js/jquery-ui-1.10.3.custom.js"></script>
        <script src="js/clienteChat.js"></script>
        <script src="js/jquery.mousewheel.js"></script>
        <script src="js/perfect-scrollbar.js"></script>        
        <link rel="stylesheet" href="css/jquery-ui-1.10.3.custom.css"/>
        <link rel="stylesheet" href="css/perfect-scrollbar.css"/>
    </head>    
    <body>
        <!--variable donde se guarda la sesion valida-->
        <input type="hidden" id="sesion" value="<?php echo $sesion; ?>"/>

        <!--inicia estructura inicial para el chat-->
        <div id="divChat" style="width: 300px; height: 300px; border: 1px solid #5550f8; z-index: 9999;" class="ui-widget ui-corner-all">
            <input id="nicknameChat" type="hidden" />
            <div id="logInChat" style="width: 100%; display: table; text-align: center;margin-left: auto;">
                <div style="display: table-cell;">                
                    <input id="nicknameChatTemp" type="text" size="20" placeholder="Ingrese su nombre"/>
                    <span id="botonLogInChat" title="Iniciar chat">Ingresar</span>                    
                </div>
            </div>
            <div style="display: none; width: 98%;height: 90%;">
                <div id="logChat" style="width: 100%; height: 88%; margin: 3px; border: 1px solid #954121; overflow: hidden; position: relative;" class="ui-corner-all">
                    <table id="contenidoChat" style="width: 100%;">                    
                    </table>
                </div>
                <div id="capturaChat" style=""><input type="text" size="20" id="mensajeChat" placeholder="Ingrese mensaje"/><span id="botonEnviarMensaje">Enviar</span></div>
            </div>
        </div>
        <!--termina la estructura inicial del chat-->
    </body>
</html>
