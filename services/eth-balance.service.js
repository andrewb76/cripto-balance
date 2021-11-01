const axios = require("axios");

const instance = axios.create({
	baseURL: "https://ropsten.infura.io/v3/98568392710f4beaa2fbdea5e1225512",
	timeout: 5000,
	headers: {
		"Content-Type": "application/json"
	}
});

module.exports = {
	name: "eth-balance",
	actions: {
		getBalance: {
			params: {
				wl: { type: "string", min: 15 }
			},
			handler(ctx) {
				// console.log("::::::", ctx.params);
				const data = {"jsonrpc":"2.0","method":"eth_getBalance","params": [`${String(ctx.params.wl).trim()}`, "latest"],"id":1};
				// console.log("::::::", ctx.params, data);
				
				return instance.request({
					method: "POST",
					data,
				})
					.then(resp => {
						// console.log("::::::", resp.data.result);
						return resp.data.result;
						// return Web3.utils.fromWei(resp.data.result);
					})
					.catch(e => {
						console.log("Get balance error", e);
						return null;
					});
			}
		},
	}
};