import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "../index.js";
import { refreshTokens, users } from "../schema.js";

export async function createRefreshToken(
  token: string,
  userId: string,
  expiresAt: Date,
) {
  const [result] = await db
    .insert(refreshTokens)
    .values({
      token,
      userId,
      expiresAt,
      revokedAt: null,
    })
    .returning();

  return result;
}

export async function userForRefreshToken(token: string) {
  const [result] = await db
    .select({
        id: users.id,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        email: users.email,
    })
    .from(refreshTokens)
    .innerJoin(users, eq(refreshTokens.userId, users.id))
    .where(
        and(
            eq(refreshTokens.token, token),
            gt(refreshTokens.expiresAt, new Date()),
            isNull(refreshTokens.revokedAt),
        ),
    );

  return result;
}

export async function revokeRefreshToken(token: string) {
    await db
        .update(refreshTokens)
        .set({ 
            revokedAt: new Date(),
            updatedAt: new Date(), 
        })
        .where(eq(refreshTokens.token, token));
}