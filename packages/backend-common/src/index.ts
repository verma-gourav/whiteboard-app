import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootEnvPath = path.resolve(__dirname, "../../../.env");

dotenv.config({ path: rootEnvPath });

export const JWT_SECRET = process.env.JWT_SECRET;
export const HTTP_PORT = process.env.HTTP_PORT;
export const WS_PORT = process.env.WS_PORT;

if (!JWT_SECRET) console.warn("JWT_SECRET not found");
if (!HTTP_PORT) console.warn("HTTP_PORT not found");
if (!WS_PORT) console.warn("WS_PORT not found");
