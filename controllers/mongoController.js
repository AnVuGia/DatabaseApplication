const {MongoClient, ObjectId} = require('mongodb');

const mongodb_uri = "mongodb://127.0.0.1:27017";
const mongo_client = new MongoClient(mongodb_uri);

// Connect to database and return the database with given name
async function connect(dbName) {
    try {
        await mongo_client.connect();

        return mongo_client.db(dbName);
    } catch (e) {
        console.error(e);
    }
}

// Find all document in collection
exports.findAll = async function (req, resp) {
    let collectionName = req.params.collection;

    console.log(collectionName);

    let db = await connect("group_asm");

    let collection = db.collection(collectionName);

    let result = await collection.find({}).toArray();

    resp.send(result);
};

// Find a document by name
exports.find = async function (req, resp) {
    let collectionName = req.params.collection;
    let dataName = req.params.name;


    let db = await connect("group_asm");

    let collection = db.collection(collectionName);

    let filter = {name: dataName};

    let result = await collection.find(filter).toArray();

    resp.send(result);
};

// Create new data
exports.create = async function (req, resp) {
    let obj = req.body.bodyRequest;
    let collectionName = req.params.collection;

    // console.log(obj);

    let db = await connect("group_asm");

    let collection = db.collection(collectionName);

    let result = await collection.insertOne(obj);

    if (result.acknowledged) {
        resp.json({status: "Successfully!"});
    }
    else {
        resp.json({status: "Failed!"});
    }
};

// Update by id
exports.update = async function (req, resp) {
    let obj = req.body.bodyRequest;
    let collectionName = req.params.collection;

    let db = await connect("group_asm");

    let collection = db.collection(collectionName);

    let filter = {_id: new ObjectId(obj._id)};

    // Delete the _id attribute from update data
    delete obj._id;

    console.log(obj)
    let update = obj;

    let result = await collection.replaceOne(filter, update);

    if (result.acknowledged) {
        resp.json({status: "Successfully!"});
    }
    else {
        resp.json({status: "Failed!"});
    }
};

// Delete by id
exports.delete = async function (req, resp) {
    let obj = req.body.bodyRequest;
    let collectionName = req.params.collection;

    let db = await connect("group_asm");

    let collection = db.collection(collectionName);

    let filter = {_id: new ObjectId(obj._id)};

    let result = await collection.deleteOne(filter);

    if (result.acknowledged) {
        resp.json({status: "Successfully!"});
    }
    else {
        resp.json({status: "Failed!"});
    }
};