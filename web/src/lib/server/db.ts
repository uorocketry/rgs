import { createClient, type Client } from "@libsql/client";
// import { LIBSQL_URL } from '$env/static/private'; // Keep commented for now, using hardcoded value

// Basic check for environment variables
// if (!LIBSQL_URL) {
// 	throw new Error("Missing required environment variable: LIBSQL_URL");
// }
const LIBSQL_URL = "http://localhost:8080"; // Replace with your actual DB URL or env var

let client: Client | null = null;

/**
 * Returns a singleton instance of the LibSQL database client.
 * Initializes the client on the first call.
 */
export function getDbClient(): Client {
	if (!client) {
		client = createClient({
			url: LIBSQL_URL,
		});
		console.log("LibSQL client initialized."); // More generic message now
	}
	return client;
}

// Optional: Add a function to close the client if needed during app shutdown
export function closeDbClient(): void {
	if (client) {
		client.close();
		client = null;
		console.log("LibSQL client closed.");
	}
} 