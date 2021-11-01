const WebSocket = require("ws");
const R = require("ramda");

let EXCHANGE_LIST = ["etheur", "ethusdt", "ornusdt"];
// let EXCHANGE_LIST = ["orneur", "ornusdt"];
let status = "disabled";
let wsStack = [];

function initWs (key) {
	let wsObj = { 
		key,
		ws: new WebSocket(`wss://stream.binance.com:9443/ws/${key}@trade`),
		value: null,
	};
	wsObj.ws.onmessage = (event) => {
		const stockObj = JSON.parse(event.data);
		wsObj.value = stockObj;
		// console.log(key, ' => ', stockObj.p);
	};
	wsObj.ws.ondisconnect = () => {
		if (status === "enabled") {
			setTimeout(() => {
				wsObj = initWs(key);
				console.log("reconnect");
			}, 500);
		}
	};
	return wsObj;
}

module.exports = {
	name: "exchange",
	actions: {
		// Shorthand definition, only the handler function
		getRates(ctx) {
			const { keys } = ctx.params;
			return R.pipe(
				// R.filter(R.includes(R.prop('key')))
				R.filter(e => R.includes(e.key, keys)),
				R.map(stackItem => [stackItem.key, stackItem.value ? stackItem.value.p : null]),
				R.fromPairs
			)(wsStack);
		},
		getTrackList() {
			return EXCHANGE_LIST;
		},
		getTrackingStatus() {
			return status;
		},
		addToTrackList(ctx) {
			if (ctx.params.key && !EXCHANGE_LIST.includes(ctx.params.key)) {
				EXCHANGE_LIST.push(ctx.params.key);
			}
			return EXCHANGE_LIST;
		},
		removefromTrackList(ctx) {
			if (ctx.params.key) {
				EXCHANGE_LIST = EXCHANGE_LIST.filter(item => item !== ctx.params.key);
			}
			return EXCHANGE_LIST;
		},
		startTracking() {
			status = "enabled";
			wsStack = EXCHANGE_LIST.map(key => initWs(key));
			return "ok";
		},
		stopTracking() {
			status = "disabled";
			wsStack.forEach(wsObj => {
				wsObj.ws.close();
			});
			wsStack = [];
			return "ok";
		},
	},

	async started() {
		wsStack = EXCHANGE_LIST.map(key => initWs(key));
	},

	async stopped() {
		wsStack = [];
	}
};