const { MongoClient } = require('mongodb');
const log = require('debug')('iacon:mongo');
const mongoOptions = { useUnifiedTopology: true };
const { promisify } = require('util');

const env = require('subheaven-env');
env.addParams([
    { name: 'MONGO_NAME', description: 'Nome do banco de dados no Mongo DB.', required: true, sample: 'iacon' },
    { name: 'MONGO_STRING', description: 'String de conexão com o Mongo DB.', required: true, sample: 'mongodb://localhost:27017/' }
]);
env.config();

// const realProcessExit = process.exit;
// process.exit = (code) => {
//     console.log("--->");
//     console.log(`PROCESS-EXIT: ${code}`);
//     realProcessExit(code);
// };
// ["EXIT", "SIGINT", "SIGUSR1", "SIGUSR2", "uncaughtException", "SIGTERM"].forEach((eventType) => {
//     const previousListeners = process.listeners(eventType);
//     process.removeAllListeners(eventType);

//     process.once(eventType, async(param) => {
//         console.log("--->");
//         console.log(`${eventType}: ${param}`);
//         await shutdown();

//         // Make prisma stop the engines after the application is ready to exit
//         previousListeners.forEach((l) => l(param));

//         realProcessExit();
//         // if (eventType !== "EXIT") {
//         //     realProcessExit();
//         // }
//     });
// });

exports.init = async() => {
    if (!this.mongoCon || !this.mongoCon.topology.isConnected()) {
        this.mongoCon = await promisify(MongoClient.connect)(process.env.MONGO_STRING, mongoOptions);
    }
}

exports.close = async() => {
    await this.mongoCon.close();
}

exports.find = async(collection, query) => {
    try {
        await exports.init();
        let ds = await this.mongoCon.db(process.env.MONGO_NAME).collection(collection).find(query).toArray();
        await exports.close();
        return ds
    } catch (e) {
        throw e;
    }
}

exports.findOne = async(collection, query) => {
    try {
        await exports.init();
        let ds = await this.mongoCon.db(process.env.MONGO_NAME).collection(collection).findOne(query);
        await exports.close();
        return ds
    } catch (e) {
        throw e;
    }
}