import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema<any>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  photo: { type: String, default: 'http://res.cloudinary.com/dm6pmvcav/image/upload/v1579183078/project-seo/1579183076769.png'}
}, 
{
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;