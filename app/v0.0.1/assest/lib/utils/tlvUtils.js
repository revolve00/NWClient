/**
 * Created by Hypnos on 16/6/16.
 */

var Map = require('./map.js').Map;

function TlvUtils() {
};


function LPositon(_vL,position) {

    var _vL = _vL;
    var _position = position;

    this.get_vL = function(){
        return _vL;
    };

    this.get_position = function() {
        return _position;
    };

};


/**
 * tlv对象方法
 * @param tag
 * @param length
 * @param value
 */
exports.tvl = function Tlv(tag, length, value){
    /** 子域Tag标签 */
    var tag = tag;

    /** 子域取值的长度 */
    var length = length;

    /** 子域取值 */
    var value = value;

    this.get_value = function() {
        return value;
    };

    this.get_tag = function() {
        return tag;
    };

    this.get_length = function() {
        return length;
    };
};

function getLengthAndPosition(hexString, position) {
    var hexLength = "";
    hexLength = hexString.substring(position, position + 2);
    position = position + 2;
    return new LPositon(parseInt(hexLength, 16), position);
};

function getTag(hexString, position) {
    if ((hexString.length - position) < 4) {
        return hexString.substring(position, hexString.length);
    } else {
        return hexString.substring(position, position + 4);
    }
};

/**
 * 左补齐
 * @param num
 * @param n
 * @returns {*}
 */
function pad(num, n) {
    var len = num.toString().length;
    while(len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}

/**
 * list组TLV HEX
 * @param tlvList
 * @returns {string}
 */
exports.encodingTLV = function(tlvList){
    var str = "";
    var len = tlvList.length;
    for (var i = 0; i < len; i++) {
        var Tlv =  tlvList[i];
        str += Tlv.get_tag() + pad(Tlv.get_length().toString(16),2)
            + Tlv.get_value();
    }
    return str;
};

/**
 * TLV  hex转TLV
 * @param hexString
 * @returns {*|Map}
 */
exports.builderTlvMap = function (hexString) {
    var tlvs = new Map();

    var position = 0;

    while ((position != hexString.length) && hexString.length != undefined && position != NaN ) {


        //alert("1::" + position + ":" + hexString.length);


        var _hexTag = getTag(hexString, position);

        if (_hexTag == "0000" || _hexTag == "00" || _hexTag == undefined) {
            break;
        }

        position += _hexTag.length;

        //alert("2::" + _hexTag + position);

        var l_position = getLengthAndPosition(hexString, position);

        var _vl = l_position.get_vL();

        position = l_position.get_position();

        var _value = hexString.substring(position, position + _vl * 2);

        position = position + _value.length;

        //alert("3::" + _hexTag + ":" + _vl + ":" +  _value);

        tlvs.put(_hexTag,new Tlv(_hexTag, _vl, _value));
    }
    return tlvs;
};