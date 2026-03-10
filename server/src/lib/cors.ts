import type { RequestHandler } from 'express';

type CorsConfig = {
    origin : string
};

export default function cors(config: CorsConfig): RequestHandler {
    return (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', config.origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
            res.sendStatus(204);
            return;
        }

        next();
    };
}