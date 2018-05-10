declare var require: any;
const MessagingResponse = require('twilio').twiml.MessagingResponse;

// const CoLaboArthonService = require('../services/coLaboArthonService').CoLaboArthonService;

import {CoLaboArthonService} from '../services/coLaboArthonService';


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

enum CODES {
	WRONG_CODE = "ERR",
	HELP = "HLP",
  REGISTER = "REG",
  REPLY = "REP",
	UNSUBSCRIBE = "UNS" //TODO: to support the unsubscribe message
}

enum PUSH_MESSAGES {
	PROMPT_REPLY = "We still haven't received your reply on a poetic prompt. Please, write a reply on one of the 3 prompts." //TODO set up time for reply
}

enum HELP_MESSAGES {
	REGISTER = "REG your_name your_background",
	REPLY = "REP ID_of_the_message_that_you_are_replying_on your_message"
}

enum LANGUAGES {
	EN = "EN",
	IT = "IT"
}

const REPLY_MAX_WORDS:number = 30;
const CODE_LENGTH:number = 3;
const CODE_DELIMITER:string = ' ';

class SMSApi {
	public lang:string = LANGUAGES.IT;
	//public lang:string = LANGUAGES.EN;
	protected twimlBody:any;
	public from:string;
	public to:string;
	public smsTxt:string;
	public code:string;
	public coLaboArthonService:CoLaboArthonService;


	constructor(twimlBody:any){
		this.coLaboArthonService = new CoLaboArthonService();
		this.twimlBody = twimlBody;
		this.from = twimlBody.From;
		this.to = twimlBody.To;
		this.smsTxt = twimlBody.Body;
		this.prepareSMS();
	}

	protected getCodesString():string{
		//TODO: make it genereates it dynamically:
		return "reg rep hlp";
	}

	protected prepareSMS(){
		//changing all the multiple empty spaces into one empty space
		//if we also want to cover tabs, newlines, etc, then:
		// this.smsTxt = this.smsTxt.replace(/\s\s+/g, ' ');
		//but so far we want to cover only spaces (and thus not tabs, newlines, etc), so we do:
		this.smsTxt = this.smsTxt.replace(/  +/g, ' ');

		if (typeof this.smsTxt === 'string') {
			//console.log('sms is string');
			this.smsTxt = this.smsTxt.trim();
		}
		else{
			console.error('prepareSMS::type:', typeof this.smsTxt);
			console.error('prepareSMS::sms:', this.smsTxt);
		}
		this.extractCode();
	}

	protected extractCode():void{
		this.code = this.smsTxt.substr(0,CODE_LENGTH).toUpperCase();
		if(this.smsTxt.substr(CODE_LENGTH,1) !== CODE_DELIMITER){
			console.error('wrong delimiter:',this.smsTxt.substr(CODE_LENGTH,1));
			this.code = CODES.WRONG_CODE;
		}
		/* doesn't work with string enums:
		if (!(this.code in CODES)) {
			this.code = CODES.WRONG_CODE;
		}
		*/

		if(this.code != CODES.REGISTER && this.code != CODES.REPLY && this.code != CODES.HELP && this.code != CODES.UNSUBSCRIBE){
			this.code = CODES.WRONG_CODE;
		}
		console.log('code:',this.code);
	}

	public processRequest():string {
		let responseMessage:string;

		//TODO: if this is not the REGISTER code, than to check if the sender is regeistered. If not, send him reply to register first
		console.log("[processRequest] this.code: ", this.code);
		switch(this.code){
				case CODES.REGISTER:
				console.log("[processRequest] registering ...");
					var result = this.registerParticipant();
					if(result){
						//TODO support name of the sender in the response message
						responseMessage = "Welcome to the CoLaboArthon! You've registered successfully ("+result+")";
					}
					else{
						responseMessage = `Sorry! There was an error in your registration. Please, send the SMS in the format: ${HELP_MESSAGES.REGISTER}`;
					}
				break;
				case CODES.REPLY:
					//TODO CHECK if the participant is not registered yet, tell him to do it first (maybe save his message so that he doesn't have to resend it)
					//TODO CHECK if this is a reply on a PROMPT and then acty differently!
					if(this.processParticipantsReply()){
						//TODO support name of the sender in the response message
						responseMessage = "Thank you for your reply!";
					}
					else{
						responseMessage = `Sorry! There was an error in processing. Please, send the SMS in the format: ${HELP_MESSAGES.REPLY}`;
					}
				break;
				default:
				case CODES.WRONG_CODE:
					responseMessage = `You have sent the wrong code. Available codes: ${this.getCodesString()}`;
					//TODO: make it like below, so that the original sent code is contained in message and not like this: "Wrong code 'ERR'. Available codes: reg rep hlp"
					// responseMessage = `Wrong code '${this.code}'. Available codes: ${this.getCodesString()}`;
				break;
		}
		return responseMessage;
	}

	/**
	example:

	*/
	protected registerParticipant():string{
		//TODO: cover situation where they used ENTER instead of " " as a delimiter
		console.log('registerParticipant:', this.smsTxt);
		let endOfNameI:number = this.smsTxt.indexOf(CODE_DELIMITER, CODE_LENGTH+1);
		let name:string = this.smsTxt.substring(CODE_LENGTH+1,endOfNameI);
		console.log("name:", name);
		let background:string = this.smsTxt.substring(endOfNameI+1);
		console.log("background:", background);

		//TODO: check if the participant is already registered - to avoid creation of a double entry


		//TODO: memorizing the participant:
		var result = this.coLaboArthonService.saveParticipant(name, background);
		return result;
		// return true;
	}

	/**
		SMS format: REP  ID_of_the_prompt  your_verse
	*/
	protected processParticipantsReply():boolean{
		let endOfID:number = this.smsTxt.indexOf(CODE_DELIMITER, CODE_LENGTH+1);
		let referenceId:number = Number(this.smsTxt.substring(CODE_LENGTH+1,endOfID));
		console.log("referenceId:", referenceId);
		let reply:string = this.smsTxt.substring(endOfID+1);
		console.log("reply:", reply);

		// TODO check if the reply exceeds the REPLY_MAX_WORDS

		//TODO: check if the referenceId exists!:
		//TODO: memorizing the reply:
		//TODO: manage "\n" in the SMSs with Enters
		//this.coLaboArthonService.saveReply(referenceId, reply);
		//TODO return the ID of his new reply to the participant (so he might share it with someone)

		return true;
	}

// app.post("/message", function (req, response) {
//   console.log('req:',req);
//   console.log('response:',response);
//   console.log(req.body);
//   response.send("<Response><Message>Hello from the CoLaboArthon - SMS Service!</Message></Response>")
// });

// app.get("/", function (req, response) {
//   console.log('req:',req);
//   console.log('response:',response);
//   response.sendFile(__dirname + '/views/index.html');
// });
//
// var listener = app.listen(process.env.PORT, function () {
//   console.log('Your app is listening on port ' + listener.address().port);
// });
} // CLASS END

// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8001/smsapi/index
// curl -v -H "Content-Type: application/json" -X GET http://api.colabo.space/smsapi/index
// https://stackoverflow.com/questions/15651510/can-typescript-export-a-function
// https://www.sitepoint.com/understanding-module-exports-exports-node-js/
export function index(req:any, res:any){
		console.log("[modules/smsapi.js:index] req: %s", JSON.stringify(req.params));
    res.send('<HTML><body>HELLO from SMSAPI</body></HTML>')
}

/*
curl -v -XPOST -H "Content-type: application/json" -d '{"from": "+381 64 2830738", "sms": "REG Sinisa poet"}' 'http://127.0.0.1:8001/smsapi'
curl -v -XPOST -H "Content-type: application/json" -d '{"from": "+381 64 2830738", "sms": "REG Sinisa poet"}' 'http://api.colabo.space/smsapi'

//CORRECT REG:
curl -v -XPOST -H "Content-type: application/json" -d '{"ToCountry":"GB","ToState":"","SmsMessageSid":"SM1423555f50af9ac75a1b48b9836f431a","NumMedia":"0","ToCity":"","FromZip":"","SmsSid":"SM1423555f50af9ac75a1b48b9836f431a","FromState":"","SmsStatus":"received","FromCity":"","Body":"REG Sinisa poet","FromCountry":"RS","To":"+447480487843","ToZip":"","NumSegments":"1","MessageSid":"SM1423555f50af9ac75a1b48b9836f431a","AccountSid":"AC3ce3ec0158e2b2f0a6857d973e42c2f1","From":"+381628317008","ApiVersion":"2010-04-01"}' 'http://127.0.0.1:8001/smsapi'

//REG with EXTRA SPACES:
curl -v -XPOST -H "Content-type: application/json" -d '{"ToCountry":"GB","ToState":"","SmsMessageSid":"SM1423555f50af9ac75a1b48b9836f431a","NumMedia":"0","ToCity":"","FromZip":"","SmsSid":"SM1423555f50af9ac75a1b48b9836f431a","FromState":"","SmsStatus":"received","FromCity":"","Body":"REG   Sinisa       poet   ","FromCountry":"RS","To":"+447480487843","ToZip":"","NumSegments":"1","MessageSid":"SM1423555f50af9ac75a1b48b9836f431a","AccountSid":"AC3ce3ec0158e2b2f0a6857d973e42c2f1","From":"+381628317008","ApiVersion":"2010-04-01"}' 'http://127.0.0.1:8001/smsapi'

//UNKNOWN CODE
curl -v -XPOST -H "Content-type: application/json" -d '{"ToCountry":"GB","ToState":"","SmsMessageSid":"SM1423555f50af9ac75a1b48b9836f431a","NumMedia":"0","ToCity":"","FromZip":"","SmsSid":"SM1423555f50af9ac75a1b48b9836f431a","FromState":"","SmsStatus":"received","FromCity":"","Body":"REGL Sinisa poet","FromCountry":"RS","To":"+447480487843","ToZip":"","NumSegments":"1","MessageSid":"SM1423555f50af9ac75a1b48b9836f431a","AccountSid":"AC3ce3ec0158e2b2f0a6857d973e42c2f1","From":"+381628317008","ApiVersion":"2010-04-01"}' 'http://127.0.0.1:8001/smsapi'

//REGISTER
curl -v -XPOST -H "Content-type: application/json" -d '{"ToCountry":"GB","ToState":"","SmsMessageSid":"SM1423555f50af9ac75a1b48b9836f431a","NumMedia":"0","ToCity":"","FromZip":"","SmsSid":"SM1423555f50af9ac75a1b48b9836f431a","FromState":"","SmsStatus":"received","FromCity":"","Body":"REG Sinisa poet","FromCountry":"RS","To":"+447480487843","ToZip":"","NumSegments":"1","MessageSid":"SM1423555f50af9ac75a1b48b9836f431a","AccountSid":"AC3ce3ec0158e2b2f0a6857d973e42c2f1","From":"+381628317008","ApiVersion":"2010-04-01"}' 'http://api.colabo.space/smsapi'

//REPLY
curl -v -XPOST -H "Content-type: application/json" -d '{"ToCountry":"GB","ToState":"","SmsMessageSid":"SM1423555f50af9ac75a1b48b9836f431a","NumMedia":"0","ToCity":"","FromZip":"","SmsSid":"SM1423555f50af9ac75a1b48b9836f431a","FromState":"","SmsStatus":"received","FromCity":"","Body":"REP 2 we have taken the immortality out of their proud hearts, because ...","FromCountry":"RS","To":"+447480487843","ToZip":"","NumSegments":"1","MessageSid":"SM1423555f50af9ac75a1b48b9836f431a","AccountSid":"AC3ce3ec0158e2b2f0a6857d973e42c2f1","From":"+381628317008","ApiVersion":"2010-04-01"}' 'http://127.0.0.1:8001/smsapi'

//REPLY with the Enter:
curl -v -XPOST -H "Content-type: application/json" -d '{"ToCountry":"GB","ToState":"","SmsMessageSid":"SM1423555f50af9ac75a1b48b9836f431a","NumMedia":"0","ToCity":"","FromZip":"","SmsSid":"SM1423555f50af9ac75a1b48b9836f431a","FromState":"","SmsStatus":"received","FromCity":"","Body":"REP 2 we have taken\nthe immortality out\nof their proud hearts\nbecause ...","FromCountry":"RS","To":"+447480487843","ToZip":"","NumSegments":"1","MessageSid":"SM1423555f50af9ac75a1b48b9836f431a","AccountSid":"AC3ce3ec0158e2b2f0a6857d973e42c2f1","From":"+381628317008","ApiVersion":"2010-04-01"}' 'http://127.0.0.1:8001/smsapi'

//REPLY - long SMS with 2 segments and Enters:
curl -v -XPOST -H "Content-type: application/json" -d '{"ToCountry":"GB","ToState":"","SmsMessageSid":"SM2edeeca395fba4df49165e0919f280c2","NumMedia":"0","ToCity":"","FromZip":"","SmsSid":"SM2edeeca395fba4df49165e0919f280c2","FromState":"","SmsStatus":"received","FromCity":"","Body":"REP 1 le nostre tremendamente grandi\nmani\nnon furono grandi\nabbastanza\n\nda proteggerci\nda tremendamente grandi mezzo secolo lunghi coltelli\ncoltelli\n\nfacendo il loro lavoro\nnella preparazione \ndella zuppa dei Balcani\nperché ...","FromCountry":"RS","To":"+447480487843","ToZip":"","NumSegments":"2","MessageSid":"SM2edeeca395fba4df49165e0919f280c2","AccountSid":"AC3ce3ec0158e2b2f0a6857d973e42c2f1","From":"+381642830738","ApiVersion":"2010-04-01"}' 'http://127.0.0.1:8001/smsapi'
*/
export function create(req:any, res:any){

	//console.log("[modules/smsapi.js:create] req: %s", req);
	//console.log("[modules/smsapi.js:create] req.body: %s", JSON.stringify(req.body));
	console.log('req.body:',req.body);
	let smsApi:SMSApi = new SMSApi(req.body);
	console.log('smsApi.smsTxt:', smsApi.smsTxt);

	let responseMessage:string = 'Welcome to the CoLaboArthon!';

	console.log("[create] smsApi.code: ", smsApi.code);

	responseMessage = smsApi.processRequest();

	const twiml = new MessagingResponse();

  twiml.message(responseMessage);

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());

	/*
	let sms:string = SMSApi.prepareSMS(req.body);
	let code:string = SMSApi.getCode(sms);
	console.log('code:', code);
	res.send("<Response><Message>Hello from the CoLaboArthon - SMS Service!</Message></Response>");
	*/
}