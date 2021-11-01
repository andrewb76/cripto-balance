const DbMixin = require("../mixins/db.mixin");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");

module.exports = {
	name: "balanceRegistry",
	mixins: [DbMixin("registry")],
	adapter: new MongooseAdapter("mongodb://0.0.0.0:27017/cripto-balance"),
	model: mongoose.model("Registry", mongoose.Schema({
		symbol: { type: String }, 
		token: { type: String },
	}, {
		timestamps: true,
	})),

	actions: {
		create: { visibility: "protected" },
		get: { visibility: "private" },
		insert: { visibility: "private" },
		remove: { visibility: "private" },
		update: { visibility: "private" },
		list: { visibility: "private" },
	},

	methods: {
		/**
		 * Loading sample data to the collection.
		 * It is called in the DB.mixin after the database
		 * connection establishing & the collection is empty.
		 */
		async seedDB() {
			await this.adapter.insertMany([
				{
					symbol: "eth",
					token: "0x1FF516E5ce789085CFF86d37fc27747dF852a80a",
				},
				{
					symbol: "eth",
					token: "0x61Eed69c0d112C690fD6f44bB621357B89fBE67F",
				},
				{
					symbol: "orn",
					token: "0xfc25454ac2db9f6ab36bc0b0b034b41061c00982",
				},	
			]);
		}
	},
};