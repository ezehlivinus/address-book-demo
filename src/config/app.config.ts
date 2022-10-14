import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  envName: process.env.NODE_ENV,
  apiPrefix: 'api/v1',
  port: parseInt(process.env.APP_PORT || process.env.PORT, 10) || 3000,
  frontendUrl: process.env.FRONTEND_URL
}));
