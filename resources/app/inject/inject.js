//const app = require('electron').remote.app;
    
const { remote } = require('electron'); 

const _path = require('path');

var serialNumber = require('serial-number');

window.$ = window.jQuery = require('jquery');

const notify = function() {
    new Notification('Novo pedido recebido!',{
        body: 'Event begins in 10 minutes',
        icon: 'http://cl.ly/J49B/3951818241085781941.png', 
    })
} 

remote.getCurrentWindow().maximize();

$(document).ready(function() { 
    serialNumber(function (err, value) {   
        var _iframe = function(serial, email) {  
            $("#iframePainel").html('\
                    <iframe class="'+Math.random()+'" src="http://pedidos360.com.br/autenticacao/authx/monstro@pedidos360.com/E652498C"  \n\
                        frameborder="0" allowfullscreen>\n\
                    </iframe>');
        };
        
        var _verificationMachine = function() { 
            $.ajax({
                dataType: 'json',
                url: "http://localhost/Delivery/site/opt/json/registerMachine/null/"+value,  
                type: 'GET'
            }).done(function(data){
                console.log(data);  

                if (data.success) {   
                    _iframe(value, data.email); 
                } else {
                    $("#modalMachineConfirmacao").modal('show');
                    $("#btnModalMachineConfirmacao").click(function() { 
                        var email = null;
                        if ($("#email-confirmacao-machine").val())
                            email = $("#email-confirmacao-machine").val();

                        $(this).addClass("disabled");
                        $("#loadingSubmit").removeClass("hidden");

                        $.ajax({
                            dataType: 'json',
                            url: "http://localhost/Delivery/site/opt/json/registerMachine/"+email+"/"+value,  
                            type: 'GET'
                        }).done(function(data){
                            console.log(data);  
                            if (data.success) {  
                                $("#modalMachineConfirmacao").modal('toggle');
                                $("#btnModalMachineConfirmacao").removeClass("disabled");
                                $("#loadingSubmit").addClass("hidden"); 
                                $(".input-email-confirmacao-machine").removeClass("has-error");

                                _iframe(value, data.email); 
                            } else {
                                $("#email-confirmacao-machine").val("");
                                $("#btnModalMachineConfirmacao").removeClass("disabled");
                                $("#loadingSubmit").addClass("hidden");
                                $(".input-email-confirmacao-machine").addClass("has-error");
                            }
                        });  
                    }); 
                }
            });   
        };
        
        _verificationMachine();
        
        //remote.getCurrentWindow().webContents.executeJavaScript('alert("Romério")');
        var _tela = function() {   
             
            $.ajax({
                dataType: 'json',
                url: "http://pedidos360.com.br/site/opt/json/alertePedidosMaquina/E652498C",  
                type: 'GET'
            }).done(function(data){
                if (data.success) {   
                    console.log(data);  
                    _verificationMachine();
                    //remote.getCurrentWindow().reload();  
                    remote.getCurrentWindow().focus(); 
                    remote.BrowserWindow.getFocusedWindow().maximize();
                    
                    $("#fa-maximizar").removeClass("fa-expand");
                    $("#fa-maximizar").addClass("fa-compress");
                }
            });   

            setTimeout(function(){
                _tela(); 
            }, 30000); 
        }

        setTimeout(function(){
            _tela(); 
        }, 30000);

        $("#btn-atualizar").click(function() { 
            remote.getCurrentWindow().reload();  
        });

        $(".btn-maximizar").click(function() {
            if (remote.BrowserWindow.getFocusedWindow().isMaximized()) {
                $("#fa-maximizar").removeClass("fa-compress");
                $("#fa-maximizar").addClass("fa-expand");
                remote.BrowserWindow.getFocusedWindow().restore();
            } else { 
                $("#fa-maximizar").removeClass("fa-expand");
                $("#fa-maximizar").addClass("fa-compress");
                remote.getCurrentWindow().maximize();
                //remote.BrowserWindow.getFocusedWindow().maximize(); 
            }
        });

        $(".btn-minimizar").click(function() {
            remote.BrowserWindow.getFocusedWindow().minimize();
        });
        //remote.BrowserWindow.getFocusedWindow().close();

        $(".btn-modal").click(function () {  
            var telPai = remote.getCurrentWindow();
            var modalWindow = new remote.BrowserWindow({
                parent: telPai,//getParentWindow(),
                modal: true,
                width: 600,
                height: 450,
                //alwaysOnTop: true,
                frame: false
            });

            //modalWindow.loadURL('https://github.com');
            modalWindow.loadURL('file://' + _path.join(__dirname, '../lib/','modal.html')); 
            /*
            modalWindow.webContents.executeJavaScript('\
                window.$ = window.jQuery = require("jquery");\n\
                $("#txt-modal").text("Sou tricolor de coração sou do clube tantas vezes campeão!");\n\
                alert("'+teste+'");'); */  

        }); 
        
    });

}); 