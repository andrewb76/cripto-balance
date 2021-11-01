const Web3 = require("web3"); 
const Promise = require("bluebird");
const R = require("ramda");  
const { interval } = require("rxjs");

const UPDATE_INTERVAL = 5000;
const SYMBOL_EXCHANGES = {
	"eth": ["usdt", "eur"],
	"orn": ["usdt"],
};

let TRACKING_LIST = [];

const $updateTimer = interval(UPDATE_INTERVAL);  


module.exports = {
	name: "balanceTracker",
	dependencies: [ "exchange", "eth-balance", "erc20-balance", "balanceLogger", "balanceRegistry" ],
	actions: {
		update: {
			visibility: "public",
			async handler(ctx) {
				TRACKING_LIST = (await this.broker.call("balanceRegistry.find")).map(wl => ({
					symbol: wl.symbol,
					token: wl.token,
				}));
				console.log(":::::: UPDATE TRACKING_LIST", TRACKING_LIST);
				return true;
			}
		},
	},

	async started() {
		this.actions.update();
		$updateTimer.subscribe(async () => {
			console.log("TRACKING_LIST", TRACKING_LIST);
			const exchangeList = R.pipe(
				R.filter((wl) => R.has(wl.symbol, SYMBOL_EXCHANGES)),
				R.map((wl) => SYMBOL_EXCHANGES[wl.symbol].map(se => wl.symbol + se)),
				R.flatten,
				R.uniq
			)(TRACKING_LIST);

			const rateDic = await this.broker.call("exchange.getRates", { keys: exchangeList });
			// console.log("::-::", rateDic);
			
			const freshBalances = await Promise.map(TRACKING_LIST, async ({ symbol, token }) => {
				let balanceWei = 0;
				if (symbol === "eth") {
					// console.log(':::>>>> ETH');
					balanceWei = await this.broker.call("eth-balance.getBalance", { wl: token });
				} else if (symbol === "orn") {
					balanceWei = await this.broker.call("erc20-balance.getBalance", { wl: token });
				} else {
					// throw new Error("Uncnown symbol", symbol);
				}
				if (!balanceWei) {
					console.log(' SKIP EMPTY VALUE ', symbol, token);
					return;
				}

				const balanceEth = Number(Web3.utils.fromWei(balanceWei));

				const rec = {
					timestamp: new Date(),
					symbol, 
					token,
					balanceWei,
					balanceEth,
					usd: rateDic[symbol+"usdt"] ? rateDic[symbol+"usdt"] * balanceEth : null,
					eur: rateDic[symbol+"eur"] ? rateDic[symbol+"eur"] * balanceEth : null,
				};

				this.broker.call("balanceLogger.create", rec);
				// .then(r => {
				//   console.log("#######", r);
				// });
			});
		});
		
	},
};