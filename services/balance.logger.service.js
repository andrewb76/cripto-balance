const R = require("ramda");  
const DbMixin = require("../mixins/db.mixin");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");

const ALLOWED_SYMBOLS = ["eur", "usd"];

module.exports = {
	name: "balanceLogger",
	mixins: [DbMixin("balance")],
	adapter: new MongooseAdapter("mongodb://0.0.0.0:27017/cripto-balance"),
	model: mongoose.model("Balance", mongoose.Schema({
		timestamp: { type: Date },
		symbol: { type: String }, 
		token: { type: String },
		balanceWei: { type: String },
		balanceEth: { type: Number, default: 0},
		usd: { type: Number, default: null},
		eur: { type: Number, default: null},
	})),
	actions: {
		create: { visibility: "protected" },
		get: { visibility: "private" },
		insert: { visibility: "private" },
		remove: { visibility: "private" },
		update: { visibility: "private" },
		list: { visibility: "private" },
		report: {
			params: {
				token: { type: "string" },
				startDate: { type: "string", default: null },
				endDate: { type: "string", default: null },
				currencies: { type: "string", default: null },
			},
			handler(ctx) {
				const { params: {token, startDate, endDate, currencies }} = ctx;
				return new Promise((resolve, reject) => {
					const curList = currencies.split(",").map(c => c.trim().toLowerCase()).filter(c => ALLOWED_SYMBOLS.includes(c));

					//check currencies
					return resolve([1,2,3,4,5,6,7,8, token, startDate, endDate, currencies, curList]);
				});
			}
		},
	}
};