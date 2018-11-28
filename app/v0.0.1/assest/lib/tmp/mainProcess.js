/**
 * Created by Hypnos on 16/6/15.
 */

function aiparker(){};

//aiparker.prototype.gui = require('nw.gui');
aiparker.prototype.dgram = require('dgram');
aiparker.prototype.net = require('net');


var MainProcess = new aiparker();
//aiparker.prototype.win = MainProcess.gui.Window.get();
aiparker.prototype.udp = MainProcess.dgram.createSocket("udp4").bind(9111);
aiparker.prototype.tcpClientList = [];
aiparker.prototype.tcpServer = MainProcess.net.createServer().listen(9000);
aiparker.prototype.tcpReadMessage = function(callback){
    MainProcess.tcpServer.on('connection', function(client) {
        // JS 可以为对象自由添加属性。这里我们添加一个 name 的自定义属性，用于表示哪个客户端（客户端的地址+端口为依据）
        client.name = client.remoteAddress + ':' + client.remotePort;
        console.dir("aa");
        //client.write('Hi ' + client.name + '!\n');
        //MainProcess.tcpClientList.push(client);
        //client.setEncoding('utf-8');
        client.on('data', function(data) {
            document.writeln(data.toString())
            callback(data, client);// 接受来自客户端的信息
        });
    });
};

aiparker.prototype.udpSendMessage = function(_ip_port_,_ip_add_,_send_message){

    var message = new Buffer(_send_message);
    MainProcess.udp.send(message, 0, message.length, _ip_port_, _ip_add_, function(msg,err) {
        //client.close();
    });
};

aiparker.prototype.udpReadMessasg = function(callback){
    MainProcess.udp.on('message',function(msg,info){
        console.log(msg);
        callback(msg);
    });
};
exports.MainProcess = MainProcess;