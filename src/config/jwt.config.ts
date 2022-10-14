import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  options: {
    issuer: 'https://github.com/ezehlivinus',
    audience: 'Vouch Digital',
    subject: 'Vouch Digital',
    expiresIn: '1h',
    algorithm: 'HS512'
  },
  secret: process.env.JWT_SECRET
}));
