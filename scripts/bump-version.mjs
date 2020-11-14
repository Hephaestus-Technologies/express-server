import fs from "fs";

const json = JSON.parse(fs.readFileSync("../packag.json"));
json.version = process.env.version;
fs.writeFileSync(JSON.stringify(json, null, 2));
