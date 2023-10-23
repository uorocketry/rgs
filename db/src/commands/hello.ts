import { Command } from "commander";
import { users } from "../schema";
import { getDatabase } from "../utils";

export default function hello(cmd: Command) {
  cmd.description("Hello world command").action(() => {
    console.log("Hello world!");

    const db = getDatabase();

    const randomName = Math.random().toString(36).substring(7);
    db.insert(users)
      .values({
        fullName: randomName,
      })
      .run();
  });
}
