"use strict";
//var exports = module.exports = {};
exports.__esModule = true;
// var express = require('express');
// var app = express();
// var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({extended: false}));
var SMSApi = /** @class */ (function () {
    // let CODES = {
    // 	HELP: "hlp",
    //   REGISTER: "reg",
    //   REPLY: "rep"
    // };
    function SMSApi() {
    }
    SMSApi.prototype.prepareSMS = function (msg) {
        var sms = msg.sms;
        if (typeof sms === 'string') {
            console.log('sms is string');
        }
        else {
            console.log('type:', typeof sms);
            console.log('sms:', sms);
        }
        return sms.trim();
    };
    SMSApi.prototype.getCode = function (sms) {
        //sms.substr(0,)
    };
    SMSApi.prototype.create = function (req, res) {
        console.log("[modules/smsapi.js:create] req: %s", req);
        console.log("[modules/smsapi.js:create] req.body: %s", JSON.stringify(req.body));
        console.log('req.body:', req.body);
        var sms = this.prepareSMS(req.body);
        res.send("<Response><Message>Hello from the CoLaboArthon - SMS Service!</Message></Response>");
    };
    // app.post("/message", function (req, response) {
    //   console.log('req:',req);
    //   console.log('response:',response);
    //   console.log(req.body);
    //   response.send("<Response><Message>Hello from the CoLaboArthon - SMS Service!</Message></Response>")
    // });
    SMSApi.prototype.index = function (req, res) {
        console.log("[modules/smsapi.js:index] req: %s", JSON.stringify(req));
        res.send('<HTML><body>HELLO from SMSAPI</body></HTML>');
    };
    return SMSApi;
}());

/*
added manually by Sinisa:

exports.create = SMSApi.prototype.create ;
exports.index = SMSApi.prototype.index ;

*/

exports.SMSApi = SMSApi;
