const MongoClient = require('mongodb').MongoClient;

const db_name = "" // db name to copy
const copy_from = "" // DB to copy the data from
const copy_to = "" // DB to copy the too

const page_amount = 1000; // how many docs to query each time

async function copyDB() {
    // connect to clusters
    const from_client = await MongoClient.connect(copy_from)
    const to_client = await MongoClient.connect(copy_to)

    // get the dbs
    const from_DB = from_client.db(db_name);
    const to_DB = to_client.db(db_name);

    // get all the collection names from the db we are copying the data
    let collections = await from_DB.listCollections().toArray();

    collections = collections.map(item => item.name);

    // iterting each collection name
    collections.forEach(async name => {
        try{
            
            // get total docs for the give collection
            const total_docs = await from_DB.collection(name).count();

            // get the total "pages" if each page has 'page_amount' docs
            const pages = Array.from({length: Math.ceil(total_docs / page_amount)}, (x, i) => i)
            
            // copy the data in each page to the "to_DB"
            for (let page in pages){

                    // get the docs
                    const data = await from_DB.collection(name).find().skip(page * page_amount).limit(page_amount).toArray();

                    // add the docs
                    await to_DB.collection(name).insertMany(data);
            };

        }catch(error){
            
            console.log("oops an error");
        };

    });

};

copyDB();

