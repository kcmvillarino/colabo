"use strict";
exports.__esModule = true;
var MessagingResponse = require('twilio').twiml.MessagingResponse;
//import twilio = require('twilio');
//const twilio = require('twilio');
// import twilio from 'twilio';
// const MessagingResponse = twilio.twiml.MessagingResponse;
// import twilio from 'twilio';
// import {MessagingResponse} from 'twilio.twiml.MessagingResponse';
//const MessagingResponse = twilio.twiml.MessagingResponse;
//var exports = module.exports = {};
// var express = require('express');
// var app = express();
// var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({extended: false}));
var CODES;
(function (CODES) {
    CODES["WRONG_CODE"] = "ERR";
    CODES["HELP"] = "HLP";
    CODES["REGISTER"] = "REG";
    CODES["REPLY"] = "REP";
    CODES["UNSUBSCRIBE"] = "UNS"; //TODO: to support the unsubscribe message
})(CODES || (CODES = {}));
var PUSH_MESSAGES;
(function (PUSH_MESSAGES) {
    PUSH_MESSAGES["PROMPT_REPLY"] = "We still haven't received your reply on a poetic prompt. Please, write a reply on one of the 3 prompts."; //TODO set up time for reply
})(PUSH_MESSAGES || (PUSH_MESSAGES = {}));
var HELP_MESSAGES;
(function (HELP_MESSAGES) {
    HELP_MESSAGES["REGISTER"] = "REG your_name your_background";
    HELP_MESSAGES["REPLY"] = "REP ID_of_the_message_that_you_are_replying_on your_message";
})(HELP_MESSAGES || (HELP_MESSAGES = {}));
var LANGUAGES;
(function (LANGUAGES) {
    LANGUAGES["EN"] = "EN";
    LANGUAGES["IT"] = "IT";
})(LANGUAGES || (LANGUAGES = {}));
var CODE_LENGTH = 3;
var CODE_DELIMITER = ' ';
var SMSApi = /** @class */ (function () {
    function SMSApi(twimlBody) {
        this.lang = LANGUAGES.IT;
        this.twimlBody = twimlBody;
        this.from = twimlBody.From;
        this.to = twimlBody.To;
        this.smsTxt = twimlBody.Body;
        this.prepareSMS();
    }
    SMSApi.prototype.getCodesString = function () {
        //TODO: make it genereates it dynamically:
        return "reg rep hlp";
    };
    SMSApi.prototype.prepareSMS = function () {
        //changing all the multiple empty spaces into one empty space
        //if we also want to cover tabs, newlines, etc, then:
        // this.smsTxt = this.smsTxt.replace(/\s\s+/g, ' ');
        //but so far we want to cover only spaces (and thus not tabs, newlines, etc), so we do:
        this.smsTxt = this.smsTxt.replace(/  +/g, ' ');
        if (typeof this.smsTxt === 'string') {
            //console.log('sms is string');
            this.smsTxt = this.smsTxt.trim();
        }
        else {
            console.error('prepareSMS::type:', typeof this.smsTxt);
            console.error('prepareSMS::sms:', this.smsTxt);
        }
        this.extractCode();
    };
    SMSApi.prototype.extractCode = function () {
        this.code = this.smsTxt.substr(0, CODE_LENGTH).toUpperCase();
        if (this.smsTxt.substr(CODE_LENGTH, 1) !== CODE_DELIMITER) {
            console.error('wrong delimiter:', this.smsTxt.substr(CODE_LENGTH, 1));
            this.code = CODES.WRONG_CODE;
        }
        /* doesn't work with string enums:
        if (!(this.code in CODES)) {
            this.code = CODES.WRONG_CODE;
        }
        */
        if (this.code != CODES.REGISTER && this.code != CODES.REPLY && this.code != CODES.HELP && this.code != CODES.UNSUBSCRIBE) {
            this.code = CODES.WRONG_CODE;
        }
        console.log('code:', this.code);
    };
    SMSApi.prototype.processRequest = function () {
        var responseMessage;
        //TODO: if this is not the REGISTER code, than to check if the sender is regeistered. If not, send him reply to register first
        switch (this.code) {
            case CODES.REGISTER:
                if (this.registerParticipant()) {
                    //TODO support name of the sender in the response message
                    responseMessage = "Welcome to the CoLaboArthon! You registered successfully";
                }
                else {
                    responseMessage = "Sorry! There was an error in your registration. Please, send the SMS in the format: " + HELP_MESSAGES.REGISTER;
                }
                break;
            case CODES.REPLY:
                //TODO CHECK if this is a reply on a PROMPT and then acty differently!
                if (this.processParticipantsReply()) {
                    //TODO support name of the sender in the response message
                    responseMessage = "Thank you for your reply!";
                }
                else {
                    responseMessage = "Sorry! There was an error in processing. Please, send the SMS in the format: " + HELP_MESSAGES.REPLY;
                }
                break;
            default:
            case CODES.WRONG_CODE:
                responseMessage = "You have sent the wrong code. Available codes: " + this.getCodesString();
                //TODO: make it like below, so that the original sent code is contained in message and not like this: "Wrong code 'ERR'. Available codes: reg rep hlp"
                // responseMessage = `Wrong code '${this.code}'. Available codes: ${this.getCodesString()}`;
                break;
        }
        return responseMessage;
    };
    /**
    example:

    */
    SMSApi.prototype.registerParticipant = function () {
        //TODO: cover situation where they used ENTER instead of " " as a delimiter
        console.log('registerParticipant:', this.smsTxt);
        var endOfNameI = this.smsTxt.indexOf(CODE_DELIMITER, CODE_LENGTH + 1);
        var name = this.smsTxt.substring(CODE_LENGTH + 1, endOfNameI);
        console.log("name:", name);
        var background = this.smsTxt.substring(endOfNameI + 1);
        console.log("background:", background);
        //TODO: memorizing the participant:
        //TODO: check if already registered:
        return true;
    };
    /**
        SMS format: REP  ID_of_the_prompt  your_verse
    */
    SMSApi.prototype.processParticipantsReply = function () {
        var endOfID = this.smsTxt.indexOf(CODE_DELIMITER, CODE_LENGTH + 1);
        var reference_id = Number(this.smsTxt.substring(CODE_LENGTH + 1, endOfID));
        console.log("reference_id:", reference_id);
        var verse = this.smsTxt.substring(endOfID + 1);
        console.log("verse:", verse);
        //TODO: check if the reference_id exists!:
        //TODO: memorizing the reply:
        //TODO return the ID of his new reply to the participant (so he might share it with someone)
        return true;
    };
    return SMSApi;
}()); // CLASS END
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8001/smsapi/index
// curl -v -H "Content-Type: application/json" -X GET http://api.colabo.space/smsapi/index
// https://stackoverflow.com/questions/15651510/can-typescript-export-a-function
// https://www.sitepoint.com/understanding-module-exports-exports-node-js/
function index(req, res) {
    console.log("[modules/smsapi.js:index] req: %s", JSON.stringify(req.params));
    res.send('<HTML><body>HELLO from SMSAPI</body></HTML>');
}
exports.index = index;
/*
curl -v -XPOST -H "Content-type: application/json" -d '{"from": "+381 64 2830738", "sms": "REG Sinisa poet"}' 'http://127.0.0.1:8001/smsapi'
curl -v -XPOST -H "Content-type: application/json" -d '{"from": "+381 64 2830738", "sms": "REG Sinisa poet"}' 'http://api.colabo.space/smsapi'

//CORRECT REG:
curl -v -XPOST -H "Content-type: application/json" -d '{"ToCountry":"GB","ToState":"","SmsMessageSid":"SM1423555f50af9ac75a1b48b9836f431a","NumMedia":"0","ToCity":"","FromZip":"","SmsSid":"SM1423555f50af9ac75a1b48b9836f431a","FromState":"","SmsStatus":"received","FromCity":"","Body":"REG Sinisa poet","FromCountry":"RS","To":"+447480487843","ToZip":"","NumSegments":"1","MessageSid":"SM1423555f50af9ac75a1b48b9836f431a","AccountSid":"AC3ce3ec0158e2b2f0a6857d973e42c2f1","From":"+381628317008","ApiVersion":"2010-04-01"}' 'http://127.0.0.1:8001/smsapi'

//REG with EXTRA SPACES:
curl -v -XPOST -H "Content-type: application/json" -d '{"ToCountry":"GB","ToState":"","SmsMessageSid":"SM1423555f50af9ac75a1b48b9836f431a","NumMedia":"0","ToCity":"","FromZip":"","SmsSid":"SM1423555f50af9ac75a1b48b9836f431a","FromState":"","SmsStatus":"received","FromCity":"","Body":"REG   Sinisa       poet   ","FromCountry":"RS","To":"+447480487843","ToZip":"","NumSegments":"1","MessageSid":"SM1423555f50af9ac75a1b48b9836f431a","AccountSid":"AC3ce3ec0158e2b2f0a6857d973e42c2f1","From":"+381628317008","ApiVersion":"2010-04-01"}' 'http://127.0.0.1:8001/smsapi'

//UNKNOWN CODE
curl -v -XPOST -H "Content-type: application/json" -d '{"ToCountry":"GB","ToState":"","SmsMessageSid":"SM1423555f50af9ac75a1b48b9836f431a","NumMedia":"0","ToCity":"","FromZip":"","SmsSid":"SM1423555f50af9ac75a1b48b9836f431a","FromState":"","SmsStatus":"received","FromCity":"","Body":"REGL Sinisa poet","FromCountry":"RS","To":"+447480487843","ToZip":"","NumSegments":"1","MessageSid":"SM1423555f50af9ac75a1b48b9836f431a","AccountSid":"AC3ce3ec0158e2b2f0a6857d973e42c2f1","From":"+381628317008","ApiVersion":"2010-04-01"}' 'http://127.0.0.1:8001/smsapi'


curl -v -XPOST -H "Content-type: application/json" -d '{"ToCountry":"GB","ToState":"","SmsMessageSid":"SM1423555f50af9ac75a1b48b9836f431a","NumMedia":"0","ToCity":"","FromZip":"","SmsSid":"SM1423555f50af9ac75a1b48b9836f431a","FromState":"","SmsStatus":"received","FromCity":"","Body":"REG Sinisa poet","FromCountry":"RS","To":"+447480487843","ToZip":"","NumSegments":"1","MessageSid":"SM1423555f50af9ac75a1b48b9836f431a","AccountSid":"AC3ce3ec0158e2b2f0a6857d973e42c2f1","From":"+381628317008","ApiVersion":"2010-04-01"}' 'http://api.colabo.space/smsapi'

*/
function create(req, res) {
    //console.log("[modules/smsapi.js:create] req: %s", req);
    //console.log("[modules/smsapi.js:create] req.body: %s", JSON.stringify(req.body));
    console.log('req.body:', req.body);
    var smsApi = new SMSApi(req.body);
    console.log('smsApi.smsTxt:', smsApi.smsTxt);
    var responseMessage = 'Welcome to the CoLaboArthon!';
    responseMessage = smsApi.processRequest();
    var twiml = new MessagingResponse();
    twiml.message(responseMessage);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
    /*
    let sms:string = SMSApi.prepareSMS(req.body);
    let code:string = SMSApi.getCode(sms);
    console.log('code:', code);
    res.send("<Response><Message>Hello from the CoLaboArthon - SMS Service!</Message></Response>");
    */
}
exports.create = create;
