const { MongoClient } = require('mongodb');
const log = require('debug')('iacon:mongo');
const mongoURL = 'mongodb://localhost:27017/';
const mongoOptions = { useUnifiedTopology: true };
const { promisify } = require('util');

exports.start = async() => {
    if (!this.mongoCon) {
        this.mongoCon = await promisify(MongoClient.connect)(mongoURL, mongoOptions);
    }
}

exports.close = async() => {
    await this.mongoCon.close();
}

exports.find = async(collection, query) => {
    try {
        let ds = await this.mongoCon.db(process.env.DBNAME).collection(collection).find(query).toArray()
        return ds
    } catch (e) {
        throw e;
    }
}

exports.new = async(collection, data, callback) => {
    MongoClient.connect(mongoURL, mongoOptions, (err, db) => {
        if (err) throw err;

        const dbo = db.db(process.env.DBNAME);
        let obj = null;

        if (data === undefined || data === null) {
            callback("Dados nulos ou inválidos!", data);
            return
        } else if (data.constructor == Object) {
            obj = data;
        } else if (Object.getPrototypeOf(data) == Map.prototype) {
            obj = Object.fromEntries(data);
        } else {
            log("Formato de dados desconhecido!");
            log(Object.getPrototypeOf(data));
            log(data);
            callback("Formato de dados desconhecido!", null);
            return
        }

        dbo.collection(collection)
            .insertOne(obj)
            .then(result => {
                db.close();
                callback(null, {
                    id: result.insertedId,
                    data: result.ops
                });
            })
            .catch(err => {
                db.close();
                callback(err, null);
            });
    });
}