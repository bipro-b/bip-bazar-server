const  mongoose = require('mongoose');
const app= require('./app');
import dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    await mongoose.connect(process.env.MONGO as string);
    console.log("🍃 MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`⚡ Server hitting on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to DB", error);
  }
}

bootstrap();
