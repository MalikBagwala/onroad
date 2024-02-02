import type { BunFile } from "bun";
import { nanoid } from "nanoid";
import { join } from "path";
import fs from "fs";

try {
  fs.mkdirSync(join(import.meta.dir, "media"), { recursive: true });
} catch (error) {
  console.log(error);
}

const server = Bun.serve({
  port: 3000,
  hostname: "0.0.0.0",
  async fetch(req) {
    const url = new URL(req.url);
    // return index.html for root path

    // parse formdata at /action
    if (url.pathname === "/uploader/upload" && req.method === "POST") {
      const formdata = await req.formData();
      const files = formdata.getAll("file");
      const saveFilePromises = files.map(async (targetFile, index) => {
        const file = targetFile as any as BunFile;
        const buffer = await file.arrayBuffer();
        const extension = file.name?.split(".").pop();
        const newFilename = `${nanoid(10)}.${extension}`;
        const path = join(import.meta.dir, "media", newFilename);
        Bun.write(path, buffer);
        return {
          originalName: file.name,
          name: newFilename,
          path: path,
          size: file.size,
          type: file.type,
        };
      });
      const result = await Promise.all(saveFilePromises);
      return Response.json({
        files: result,
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(
  `Uploader listning on http://${server.hostname}:${server.port} ...`
);
