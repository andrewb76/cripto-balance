const Openapi = require("moleculer-auto-openapi");

module.exports = {
	name: "openapi",
	mixins: [Openapi],
	settings: {
		// all setting optional
		openapi: {
			info: {
				version: "0.0.1",
				// about project
				title: "ORN Test Task",
				description: "Cripto Balance Tracker",
				contact: {
					name: "Andrew B.",
					url: "https://github.com/andrewb76/crypto-balance",
					email: "andrewb@bk.ru"
				},
			},
			tags: [
				// you tags
				{ name: "auth", description: "My custom name" },
			],
			components: {
				// you auth
				securitySchemes: {
					myBasicAuth: {
						type: "http",
						scheme: "basic",
					},
				},
			},
		},
	},
};