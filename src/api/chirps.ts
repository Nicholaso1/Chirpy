import { Request, Response } from 'express';
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from '../errors.js';
import { createChirp, deleteChirp, getAllChirps, getChirpsByAuthor} from '../db/queries/chirps.js';
import { getChirp } from '../db/queries/chirps.js';
import { getBearerToken, validateJWT } from '../auth.js';
import { config } from '../config.js';

export async function handlerCreateChirp(req: Request, res: Response) {
    const body = req.body?.body;

    let userId: string;

    try {
        const token = getBearerToken(req);
        userId = validateJWT(token, config.jwtSecret);
    } catch {
        throw new UnauthorizedError("Invalid or missing JWT token");
    }

    if (typeof body !== "string" || body.length === 0) {
        throw new BadRequestError("Chirp body is required and must be a non-empty string");
    }

    if (body.length > 140) {
        throw new BadRequestError("Chirp body exceeds 140 characters");
    }

    if (typeof userId !== "string") {
        throw new BadRequestError("User ID must be a string");
    }

    const cleanedBody = body.replace(/\b(kerfuffle|sharbert|fornax)\b/gi, "****");

    const chirp = await createChirp({ body: cleanedBody, userId: userId });

    return res.status(201).json(chirp);
}

export async function handlerGetAllChirps(req: Request, res: Response) {
    const authorId = req.query.authorId;
    const sort = req.query.sort;

    let chirps;

    if (typeof authorId === "string") {
        chirps = await getChirpsByAuthor(authorId);
    } else {
        chirps = await getAllChirps();
    }

    if (sort === "desc") {
        chirps.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else {
        chirps.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }
    
    return res.status(200).json(chirps);
}

export async function handlerGetChirp(req: Request, res: Response) {
    const chirpId = req.params.chirpId;

    if (typeof chirpId !== "string") {
        throw new BadRequestError("Chirp ID must be a string");
    }

    const chirp = await getChirp(chirpId);

    if (!chirp) {
        return res.status(404).json({ error: "Chirp not found" });
    }

    return res.status(200).json(chirp);
}

export async function handlerDeleteChirp(req: Request, res: Response) {
    let userId: string;

    try {
        const token = getBearerToken(req);
        userId = validateJWT(token, config.jwtSecret);
    } catch {
        throw new UnauthorizedError("Invalid or missing JWT token");
    }

    const chirpId = req.params.chirpId;

    if (typeof chirpId !== "string") {
        throw new BadRequestError("Chirp ID must be a string");
    }

    const chirp = await getChirp(chirpId);

    if (!chirp) {
        throw new NotFoundError("Chirp not found");
    }

    if (chirp.userId !== userId) {
        throw new ForbiddenError("You are not the owner of this chirp");
    }

    await deleteChirp(chirp.id);

    return res.status(204).send();
}





