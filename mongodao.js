/*
mongo database crud operation handled by nodejs driver
**/

/*
module dependencies
**/
require('dotenv/config');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const MongoDao = class {

	constructor() {
		var _this = this;
		var options = { useNewUrlParser: true };
		this.mongoClient = new MongoClient(process.env.DB_CONNECTION, options);

		this.mongoClient.connect(function (err, client) {
			assert.strictEqual(err, null);
			console.log("mongo client successfully connected \n");
			_this.dbConnection = client.db(process.env.DB_NAME);
		});
	}

	readCollection(collectionName, callback) {
		return this.dbConnection.collection(collectionName)
			.find({}).toArray(function (err, items) {
				callback(items);
			});
	}
	printDocument(collectionName, doc, callback) {
		return this.dbConnection.collection(collectionName)
			.find({ _id: Number(doc) })
			.toArray(function (err, items) {
				callback(items);
			});
	}

	// insert a document in the given collection
	insertDocument(collectionName, doc, callback) {
		var _this = this;
		_this.getNextSequenceValue("productid", function (sequence_value) {
			_this.dbConnection.collection(collectionName).insertOne(
				{ ...doc, _id: sequence_value },
				function (err, result) {
					assert.strictEqual(null, err);
					return _this.printDocument(collectionName, sequence_value, callback);
				}
			);
		});
	}

	updateDocument(collectionName, doc, updateDocument, callback) {
		var _this = this;
		return this.dbConnection.collection(collectionName).updateOne({ _id: Number(doc) },
			{ $set: updateDocument }, function (err, result) {
				assert.strictEqual(null, err);
				console.log(result.result.ok + " document updated successfully");
				_this.printDocument(collectionName, doc, callback);
			});
	}

	deleteDocument = function (collectionName, doc, callback) {
		return this.dbConnection.collection(collectionName).deleteOne({ _id: Number(doc) }, function (err, result) {
			assert.strictEqual(null, err);
			callback();
		});
	}

	getNextSequenceValue = function (sequenceName, callback) {
		return this.dbConnection.collection("counters")
			.findOneAndUpdate(
				{ _id: sequenceName },
				{ $inc: { sequence_value: 1 } },
				function (err, sequenceDocument) {
					assert.strictEqual(null, err);
					callback(sequenceDocument.value.sequence_value);
				});

	}
}



module.exports = MongoDao;