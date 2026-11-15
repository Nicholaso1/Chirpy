import { describe, it, expect } from 'vitest';
import {
    makeJWT,
    validateJWT,
    hashPassword,
    checkPasswordHash,
    extractBearerToken,
} from './auth.js';

import { BadRequestError } from './errors.js';

describe("JWT", () => {
    const userID = "123e4567-e89b-12d3-a456-426614174000";
    const secret = "test-secret";

    it("should create and validate a JWT", () => {
        const token = makeJWT(userID, 60, secret);
        const result = validateJWT(token, secret);
        expect(result).toBe(userID);
    });

    it ("should reject an expired JWT", () => {
        const token = makeJWT(userID, -1, secret);

        expect(() => validateJWT(token, secret)).toThrow("Invalid token or expired token");
    });

    it("should reject a a JWT signed with the wrong secret", () => {
        const token = makeJWT(userID, 60, secret);
        expect(() => validateJWT(token, "wrong-secret")).toThrow("Invalid token or expired token");
    });
}) 

describe("Password Hashing", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword456!";
    let hash1: string;

    it("should hash a password", async () => {
        hash1 = await hashPassword(password1);

        expect(hash1).not.toBe(password1);
    });

    it("should return true for a correct password", async () => {
        const result = await checkPasswordHash(password1, hash1);
        expect(result).toBe(true);
    });

    it("should return false for an incorrect password", async () => {
        const result = await checkPasswordHash(password2, hash1);
        expect(result).toBe(false);
    });
})

describe("Bearer Token Extraction", () => {
    it("should extract a valid Bearer token", () => {
        const result = extractBearerToken("Bearer abc123");
        expect(result).toBe("abc123");
    });

    it("should handle extra whitespace", () => {
        const result = extractBearerToken("  Bearer   abc123  ");
        expect(result).toBe("abc123");
    });

    it("should throw an error for a missing Authorization header", () => {
        expect(() => extractBearerToken(undefined)).toThrow(BadRequestError);
    });

    it("should throw BadRequestError for an empty Bearer token", () => {
        expect(() => extractBearerToken("Bearer ")).toThrow(BadRequestError);
    });
    
    it("should throw BadRequestError for an invalid format", () => {
        expect(() => extractBearerToken("InvalidFormat abc123")).toThrow(BadRequestError);
    });
});


