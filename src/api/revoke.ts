import type { Request, Response } from 'express';
import { getBearerToken } from '../auth.js';
import { UnauthorizedError } from '../errors.js';
import { revokeRefreshToken } from '../db/queries/refreshTokens.js';

export async function handlerRevoke(req: Request, res: Response) {
    let token: string;

    try {
        token = getBearerToken(req);
    } catch {
        throw new UnauthorizedError("Invalid or missing refresh token");
    }

    await revokeRefreshToken(token);

    return res.status(204).send();
}


