import { app } from './app';

const start = async () => {
  try {
    const PORT = parseInt(process.env.PORT || '3000', 10);
    await app.listen({ port: PORT, host: '0.0.0.0' });
    app.log.info(`Server listening on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
