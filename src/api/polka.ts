import type { Request, Response } from 'express';
import { upgradeUser } from '../db/queries/users.js';
import { NotFoundError } from '../errors.js';
import { getAPIKey } from "../auth.js";
import { config } from "../config.js";
import { UnauthorizedError } from "../errors.js";

export async function handlerPolkaWebhook(req: Request, res: Response) {
    try {
        const apiKey = getAPIKey(req);

        if (apiKey !== config.api.polkaKey) {
            throw new UnauthorizedError("Invalid or missing Polka API key");
        }
    } catch {
        throw new UnauthorizedError("Invalid or missing Polka API key");
    }
    
    const { event, data } = req.body;

    if (event !== "user.upgraded") {
        return res.status(400).send();
    }

    const user = await upgradeUser(data.userId);

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return res.status(204).send();
}