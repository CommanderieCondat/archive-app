import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  source: { type: String, required: true },
  json_data: { type: Object, required: false},
  image_data: { type: Buffer, required: false},

}, { collection: 'inventaire-malte' });  // 👈 Specify the collection name here

export default mongoose.models.Archive || mongoose.model('Archive', fileSchema);
