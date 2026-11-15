import { Request, Response, NextFunction } from 'express';
import { config } from './config.js';
import {
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError
} from './errors.js';

export function middlewareLogResponses(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.on('finish', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
            console.log(
                `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`,
      );
        }
    });

    next();
}

export function middlewareMetricsInc(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    config.api.fileserverHits += 1;
    next();
}

export function middlewareErrorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    console.log(err);

    if (err instanceof BadRequestError) {
        return res.status(400).json({
            error: err.message,
        });
    }

    if (err instanceof UnauthorizedError) {
        return res.status(401).json({
            error: err.message,
        });
    }

    if (err instanceof ForbiddenError) {
        return res.status(403).json({
            error: err.message,
        });
    }

    if (err instanceof NotFoundError) {
        return res.status(404).json({
            error: err.message,
        });
    }

    res.status(500).json({
        error: "Something went wrong on our end,"
    });
}
