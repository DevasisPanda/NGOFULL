import { User } from "../../drizzle/schema";

export type SafeUser = Pick<User, "id" | "email" | "name" | "role" | "status" | "profileImage" | "bio">;

/**
 * Strips sensitive fields (like passwordHash, Aadhaar, full address) from the user object
 * before returning it to the client.
 */
export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
    profileImage: user.profileImage,
    bio: user.bio,
  };
}

/**
 * Strips ONLY the passwordHash for admin-level responses.
 * Admins are allowed to see PII (phone, address, Aadhaar), but never password hashes.
 */
export function excludePassword<T extends { passwordHash?: string | null }>(user: T): Omit<T, 'passwordHash'> {
  const { passwordHash, ...rest } = user;
  return rest;
}
