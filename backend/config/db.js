require('dotenv').config();
const nano = require('nano')(process.env.COUCHDB_URL);

const dbNames = {
    admin: 'inventory_admin',
    users: 'inventory_users',
    products: 'inventory_products'
};

const adminDb = nano.db.use(dbNames.admin);
const userDb = nano.db.use(dbNames.users);
const productsDb = nano.db.use(dbNames.products);

async function setupDatabase(dbName) {
    try {
        await nano.db.get(dbName);
        console.log(`Database "${dbName}" already exists.`);
    } catch (err) {
        if (err.statusCode === 404) {
            console.log(`Database "${dbName}" not found. Creating...`);
            await nano.db.create(dbName);
            console.log(`Database "${dbName}" created.`);
        } else {
            console.error(`Error checking database "${dbName}":`, err);
        }
    }
}

// Setup all databases when server starts
async function initializeDatabases() {
    try {
        await setupDatabase(dbNames.admin);
        await setupDatabase(dbNames.users);
        await setupDatabase(dbNames.products);
        console.log("All databases initialized successfully.");
    } catch (error) {
        console.error("Error initializing databases:", error);
    }
}

module.exports = { nano, adminDb, userDb, productsDb, initializeDatabases };
