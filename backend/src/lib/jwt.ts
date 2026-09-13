import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "paty-flores-dev-secret";

export type JwtUser = {
  id: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
};

export function signToken(user: JwtUser) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): JwtUser & { sub: string } {
  return jwt.verify(token, JWT_SECRET) as JwtUser & { sub: string };
}
