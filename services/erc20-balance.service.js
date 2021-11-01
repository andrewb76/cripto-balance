const Web3 = require("web3");
const provider = "https://ropsten.infura.io/v3/98568392710f4beaa2fbdea5e1225512";
const Web3Client = new Web3(new Web3.providers.HttpProvider(provider));

const minABI = [  
	// balanceOf
	{    
		constant: true,
		inputs: [{ name: "_owner", type: "address" }],
		name: "balanceOf",
		outputs: [{ name: "balance", type: "uint256" }],
		type: "function",
	},
];

const contractAddress = "0xfc25454ac2db9f6ab36bc0b0b034b41061c00982";

const contract = new Web3Client.eth.Contract(minABI, contractAddress);

module.exports = {
	name: "erc20-balance",
	actions: {
		getBalance: {
			params: {
				wl: { type: "string", min: 15 }
			},
			handler(ctx) {
				const { params: { wl }} = ctx;
				return contract.methods.balanceOf(wl).call();
			}
		},
	}
};