// import pino from 'pino-http';

// export const logger = pino({
//   transport: {
//     target: 'pino-pretty',
//   },
// });
import pino from 'pino-http';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: { colorize: true },
      },
  level: 'info',
});
