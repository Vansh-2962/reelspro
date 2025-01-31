import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please provide a MONGODB_URI");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: true, // isse .find() .updateOne() aur aise sare methods tb he run krenge jb mera db se connection nhi ho jata.
      maxPoolSize: 10,
    };
    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then(() => mongoose.connection);
  }

  try {
    await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw new Error("Some error occured in db connection🤔");
  }
}
