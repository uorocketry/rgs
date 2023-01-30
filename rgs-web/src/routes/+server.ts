import * as fs from "fs";
let dir = "./data";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
