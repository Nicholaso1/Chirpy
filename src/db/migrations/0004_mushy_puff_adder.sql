ALTER TABLE "refresh_tokens" ADD COLUMN "revoked_at" timestamp;--> statement-breakpoint
ALTER TABLE "refresh_tokens" DROP COLUMN "revoked";