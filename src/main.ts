import { ConfigService } from '@nestjs/config';

import { start } from './fastify.bootstrap';

async function bootstrap() {
  const app = await start();

  const configService = app.get(ConfigService);
  const port = configService.get('PORT_TARGET');

  app.listen(port, '0.0.0.0');
  console.info(`App listening on port ${port}`);
}

bootstrap();
