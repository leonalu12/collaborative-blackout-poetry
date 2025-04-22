const mongoose = require('mongoose');

beforeAll(async () => {
  const uri = process.env.MONGO_URI || 'mongodb://mongo:27017/test-db';
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'test-db',
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});