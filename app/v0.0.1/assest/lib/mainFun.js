/**
 * Created by Hypnos on 16/6/16.
 */

function aiparker(){};
var Map = require('../assest/lib/utils/map.js').Map;
aiparker.prototype.gui = require('nw.gui');
aiparker.prototype.dgram = require('dgram');
aiparker.prototype.net = require('net');
aiparker.prototype.prop = require("properties-parser");
aiparker.prototype.tlvUtils = require("../assest/lib/utils/tlvUtils.js");

global.MainFun = new aiparker();

aiparker.prototype.win = global.MainFun.gui.Window.get();


aiparker.prototype.syseditor = global.MainFun.prop.createEditor("./assest/sysconfig.properties");



/**
 * 读取Properties文件
 * @param _file_path_  文件路径
 * @param callback     回调方法
 * @constructor
 */
aiparker.prototype.ReadProperties = function (_file_path_,callback) {
    global.MainFun.prop.read(_file_path_, function (err, data) {
        console.log(err);
        callback(data);
    });
};

/***
 * UDP 服务
 *
 */
aiparker.prototype.udpServer = global.MainFun.dgram.createSocket("udp4").bind(global.MainFun.editor.get("udp_port"));
aiparker.prototype.udpSendMessage = function(_ip_port_,_ip_add_,_send_message){

    var message = new Buffer(_send_message);
    global.MainFun.udpServer.send(message, 0, message.length, _ip_port_, _ip_add_, function(msg,err) {
        //client.close();
    });
};

aiparker.prototype.updSendMessageTlv = function(_ip_port_,_ip_add_,tlvArray){
    var hexString = global.MainFun.tlvUtils.encodingTLV(tlvArray);
    global.MainFun.udpSendMessage()

};

aiparker.prototype.udpReadMessasg = function(_callback){
    global.MainFun.udpServer.on('message',function(msg,info){
        _callback(info,msg);
    });
};

/***
 * TCP 服务
 */
aiparker.prototype.tcpServer = global.MainFun.net.createServer().listen(global.MainFun.editor.get("tcp_port"));

aiparker.prototype.tcpClientList = new Map();

aiparker.prototype.tcpReadMessage = function(callback){
    global.MainFun.tcpServer.on('connection', function(client) {
        // JS 可以为对象自由添加属性。这里我们添加一个 name 的自定义属性，用于表示哪个客户端（客户端的地址+端口为依据）
        client.name = client.remoteAddress + ':' + client.remotePort;
        client.write('Hi ' + client.name + '!\n');
        client.setEncoding('hex');
        global.MainFun.tcpClientList.put(client.name,client);
        client.on('data', function(data) {
            console.log(data.toString() + ":::" + new Date());
            callback(data, client);// 接受来自客户端的信息
        });
    });
};

aiparker.prototype.tcpSendMessage = function(_tcp_client_,_send_message_){
    _tcp_client_.write(_send_message_);
};
