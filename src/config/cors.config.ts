type originCallback = (err: Error | null, allow?: boolean) => void;

const allowedOrigins = [
  'http://localhost:5173',
  'https://head-hunter-ynt4.onrender.com',
  '3.75.158.163',
  '3.125.183.140',
  '35.157.117.28',
];

export const corsConfig = {
  origin: function (origin: string | undefined, callback: originCallback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
