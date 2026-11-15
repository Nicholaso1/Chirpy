import { Request, Response } from 'express';
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from '../errors.js';
import { createUser } from '../db/queries/users.js';
import { hashPassword, getBearerToken, validateJWT } from '../auth.js';
import { users } from '../db/schema.js';
import { updateUser } from '../db/queries/users.js';
import { config } from '../config.js';

type UserResponse = Omit<typeof users.$inferSelect, "hashedPassword">;

export async function handlerCreateUser(req: Request, res: Response) {
  const { email, password } = req.body ?? {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.length === 0 ||
    password.length === 0
  ) {
    throw new BadRequestError("Email and password are required");
  }

  const hashedPassword = await hashPassword(password);

  const user = await createUser({
    email,
    hashedPassword,
  });

  if (!user) {
    throw new Error("Could not create user");
  }

  const userResponse: UserResponse = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    isChirpyRed: user.isChirpyRed,
  };

  return res.status(201).json(userResponse);
}

export async function handlerUpdateUser(req: Request, res: Response) {
    let userId: string;

    try {
        const token = getBearerToken(req);
        userId = validateJWT(token, config.jwtSecret);
    } catch {
        throw new UnauthorizedError("Invalid or missing JWT token");
    }

    const { email, password} = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
        throw new BadRequestError("Email and password are required");
    }

    const hashedPassword = await hashPassword(password);

    const user = await updateUser(userId, email, hashedPassword);

    if (!user) {
        throw new NotFoundError("User not found");
    }

    const { hashedPassword: _, ...userResponse } = user;
    
    return res.status(200).json(userResponse);

}