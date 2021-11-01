"use strict";

const { ServiceBroker } = require("moleculer");
const { ValidationError } = require("moleculer").Errors;
const BalanceShema = require("../../../services/balance.service");

describe("Test 'balance' service", () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(BalanceShema);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test 'balance.tokens' action", () => {

		it("should return with tracking tokens list", async () => {
			const res = await broker.call("balance.tokens");
			console.log(':::::::::', res);
			expect(res).toBeInstanceOf(Array);
		});

	});

	describe("Test 'balance.addToken' action", () => {

		
		// it("should reject an ValidationError without token", async () => {
		// 	const res = await broker.call("balance.addToken", { symbol: "eth" });
		// 	expect(res).toBeInstanceOf(ValidationError);
		// });

		it("should reject an ValidationError without symbol", async () => {
			expect.assertions(1);
			try {
				await broker.call("balance.addToken", { token: "0x0023rd2d3a732v3sq22332" });
			} catch(err) {
				expect(err).toBeInstanceOf(ValidationError);
			}
		});

	});

});

