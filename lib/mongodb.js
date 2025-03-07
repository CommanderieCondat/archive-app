import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {

  // console.log('cache',cached.conn)

  if (cached.conn) {
    // console.log('hello!!!!')
    console.log('✅ Reusing existing MongoDB connection.');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🔄 Establishing new MongoDB connection...');
    cached.promise = mongoose.connect(MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      dbName: 'archives',  // 👈 Make sure this is correct
    }).then((mongoose) => {
      console.log('✅ Connected to MongoDB:', mongoose.connection.name);
      return mongoose;
    });
   }

  cached.conn = await cached.promise;
  return cached.conn;
}

export { connectToDatabase };

// import { MongoClient } from "mongodb";

// let cachedClient = null;
// let cachedDb = null;

// export async function connectToDatabase() {
//   if (cachedClient && cachedDb) {
//     return { client: cachedClient, db: cachedDb };
//   }

//   const client = await MongoClient.connect(process.env.MONGODB_URI);
//   const db = client.db();  // Use default database from URI

//   cachedClient = client;
//   cachedDb = db;

//   return { client, db };
// }
