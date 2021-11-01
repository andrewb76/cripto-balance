"use strict";
const { MoleculerError } = require("moleculer").Errors;


/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const ALLOWED_SYMBOLS = ["eth", "orn"]; // todo: move to conf.
const ALLOWED_CURENCY = ["usd", "eur"]; // todo: move to conf.

module.exports = {
	name: "balance",

	/**
	 * Settings
	 */
	settings: {

	},

	/**
	 * Dependencies
	 */
	dependencies: ["balanceRegistry", "balanceLogger"],

	/**
	 * Actions
	 */
	actions: {

		/**
		 * Get list of tracking tokens.
		 *
		 * @returns
		 */
		tokens: {
			rest: {
				method: "GET",
				path: "/tokens"
			},			
			handler: async (ctx) => {
				return ctx.call("balanceRegistry.find", {});
			},
		},


		/**
		 * Add token to tracker.
		 *
		 * @returns
		 */
		addToken: {
			rest: {
				method: "POST",
				path: "/addToken"
			},			
			params: {
				symbol: { type: "string", values: ALLOWED_SYMBOLS },
				token: { type: "string", min: 15 },
			},
			handler: async (ctx) => {
				return new Promise((resolve, reject) => {
					const { symbol, token } = ctx.params;
					if (!ALLOWED_SYMBOLS.includes(symbol)) {
						return reject(`Unknown symbol [${symbol}], use one from: ${ALLOWED_SYMBOLS.join(", ")}.`);
					}
					ctx.call("balanceRegistry.find", { query: { symbol, token } })
						.then(c => {
							if (c.length) {
								return reject(`Token [${symbol}][${token}] alredy exists.`);
							}
							return ctx.call("balanceRegistry.create", { symbol, token })
								.then(() => resolve(`Token [${symbol}][${token}] added.`));
						})
						.catch(e => {
							return reject (`Error: [${e}].`);
						});
				});
			},
		},

		/**
		 * Remove token from tracker.
		 *
		 * @returns
		 */
		removeToken: {
			rest: {
				method: "POST",
				path: "/removeToken"
			},			
			params: {
				symbol: { type: "string", required: true },
				token: { type: "string", required: true },
			},
			handler: async (ctx) => {
				const { symbol, token } = ctx.params;
				return ctx.call("balanceRegistry.find", { query: { symbol, token } })
					.then(r => {
						if (r.length) {
							return ctx.call("balanceRegistry.remove", { id: r[0]._id } )
								.then(() => "Token removed seccessfuly." );
						}
						return new MoleculerError("Token not found", 404);
					});
			},
		},

		report: {
			rest: {
				method: "GET",
				path: "/report"
			},			
			params: {
				start: { type: "string" },
				finish: { type: "string" },
				startT: { type: "string" },
				finishT: { type: "string" },
				token: { type: "string" },
				curencies: { type: "string" },
				limit: { type: "number", default: 20 },
				offset: { type: "number", default: 0 },
			},
			handler: async (ctx) => {
				const { limit = 20, offset = 0, start, finish, startT, finishT, token, curencies } = ctx.params;
				const curencyList = curencies.split(",").map(c => c.toLowerCase()).filter(c => ALLOWED_CURENCY.includes(c));

				const from = `${start}T${startT}:00.000Z`;
				const to = `${finish}T${finishT}:00.000Z`;

				if (!curencyList.length) {
					curencyList.push("usd");
				}

				console.log("REPORT: ", from, to);
				return ctx.call("balanceLogger.find", { 
					fields: ["timestamp", ...curencyList],
					query: {
						token,
						$and: [
							{ timestamp: { $gte: from } },
							{ timestamp: { $lte: to } },
						],
						$or: [
							{ usd: { $ne: null }}, 
							{ eur: { $ne: null }},
						]
					}, 
					limit,
					offset,
				});
			},
		},
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
