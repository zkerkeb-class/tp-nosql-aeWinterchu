import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/user.js';

const clean = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connexion pour nettoyage...');
    
    await User.deleteMany({});
    console.log('✅ Tous les utilisateurs ont été supprimés !');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

clean();