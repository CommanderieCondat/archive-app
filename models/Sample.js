import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  id_line: {type:Number,required: true},
  image_data: { type: Buffer, required: false},
  text: { type:String, required: false}

}, { collection: 'samples' });  // 👈 Specify the collection name here

export default mongoose.models.Sample || mongoose.model('Sample', fileSchema);
