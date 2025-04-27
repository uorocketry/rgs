import { createClient } from "@libsql/client";

const client = createClient({
    url: "http://127.0.0.1:8080",
});

// Create a table
await client.execute(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)"
);

// Insert a row

function getRandomString(length: number) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

for (let index = 0; index < 1000; index++) {
    const randomName = getRandomString(10);
    const randomEmail = `${getRandomString(10)}@example.com`;

    const insertResult = await client.execute({
        sql: "INSERT INTO users (name, email) VALUES (?, ?) RETURNING id",
        args: [randomName, randomEmail],
    });
    // Query the row
    const userId = insertResult.rows[0].id;
    const result = await client.execute({
        sql: "SELECT * FROM users WHERE id = ?",
        args: [userId],
    });

    // Print the result
    const row = result.rows[0];
    console.log(`Name: ${row.name}, Email: ${row.email}`);
}
