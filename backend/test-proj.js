const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/goto_test_db');
  
  const schema = new mongoose.Schema({
    originalUrl: String,
    shortCode: String,
    userId: String,
    createdAt: Date
  });
  const Model = mongoose.model('TestUrl', schema);
  
  await Model.create({ originalUrl: 'http://test.com', shortCode: 'test', userId: '1', createdAt: new Date() });
  
  const docs = await Model.find({ userId: '1' }, { createdAt: -1 }).lean();
  console.log("Projection with { createdAt: -1 }:", docs);
  
  await mongoose.disconnect();
}
test().catch(console.error);