import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { BadRequestError } from './errors.js';
import type { Request, Response } from 'express';
import crypto from 'node:crypto';

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">; 

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}

export async function checkPasswordHash(
    password: string,
    hash: string,
): Promise<boolean> {
  return await argon2.verify(hash, password);
}

export function makeJWT(
    userID: string,
    expiresIn: number,
    secret: string,
): string {
    const now = Math.floor(Date.now() / 1000);

    const payload: Payload = {
        iss: "chirpy",
        sub: userID,
        iat: now,
        exp: now + expiresIn,
    };

    return jwt.sign(payload, secret);
}

export function validateJWT(
    tokenString: string,
    secret: string,
): string {
    try {
        const decoded = jwt.verify(tokenString, secret);

        if (typeof decoded === "string" || typeof decoded.sub !== "string") {
            throw new Error("Invalid token");
        }
        return decoded.sub;
    } catch (error) {
        throw new Error("Invalid token or expired token");
    }
}

export function extractBearerToken(
    authorization: string | undefined,
): string {
    if (!authorization) {
        throw new BadRequestError("Authorization header is missing");
    }

    const parts = authorization.trim().split(/\s+/);
    
    if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
        throw new BadRequestError("Invalid authorization header");
    }

    return parts[1];
}

export function getBearerToken(req: Request): string {
    return extractBearerToken(req.get("Authorization"));
}

export function makeRefreshToken(): string {
    return crypto.randomBytes(32).toString("hex");
}

export function getAPIKey(req: Request): string {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
        throw new Error("Missing API key in Authorization header");
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "ApiKey" || !parts[1]) {
        throw new Error("Invalid Authorization header format. Expected 'ApiKey <key>'");
    }

    return parts[1];
}