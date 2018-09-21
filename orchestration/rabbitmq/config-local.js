if (!global.hasOwnProperty('queue_broker')) {
	console.log("Setting up global.queue_broker");
	global.queue_broker = {
        // https://www.rabbitmq.com/uri-spec.html
        // amqp://user:pass@host.com:port/vhost
		'url': 'amqp://localhost:5672',
		// 'url': 'amqp://colabo:colabo_usr56@localhost:5672',
		// 'url': 'amqp://guest:guest@localhost:5672',
		'queue': 'colabo-service-localhost',
		shouldRequestResult: true,
		noAck: false
	};
}

module.exports = global;