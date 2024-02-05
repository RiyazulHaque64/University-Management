import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { seedSuperAdmin } from './app/db';

let server: Server;
async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    await seedSuperAdmin();
    server = app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();

process.on('unhandledRejection', () => {
  console.log(`Unhandled rejection is detected, shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`Uncaught exception is detected, shutting down ...`);
  process.exit(1);
});
