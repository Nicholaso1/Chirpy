import { Request, Response } from 'express';
import { config } from '../config.js';
import { deleteAllUsers } from '../db/queries/users.js';
import { ForbiddenError } from '../errors.js';

export async function handlerReset(req: Request, res: Response) {
    if (config.api.platform !== "dev") {
        throw new ForbiddenError("Reset is only allowed in dev mode");
    }

    config.api.fileserverHits = 0;

    await deleteAllUsers();

    return res.status(200).send("Hits reset to 0");
}


