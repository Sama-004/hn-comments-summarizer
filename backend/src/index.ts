import { zValidator } from "@hono/zod-validator";
import axios from "axios";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import { isValid } from "zod";

type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key];
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/*", cors());

// app.get("/", async (c) => {
//   const url = c.req.query("url");

//   if (!url?.startsWith("https://news.ycombinator.com/item?id=")) {
//     return c.json(
//       {
//         message: "Invalid URL",
//       },
//       401
//     );
//   }

//   const fullJson = await axios.get(url);

//   const comments = fullJson.data.match(
//     /<div class="commtext c01">(.*?)<\/div>/gs
//   );

//   if (!comments) {
//     return c.json(
//       {
//         message: "No comments found",
//       },
//       405
//     );
//   }

//   return c.text(comments.json("\n"));
//   const textComments = comments.map((comment: any) =>
//     comment.replace(/<div class="commtext c01">|<\/div>/gs, "")
//   );
//   const topComments = textComments.slice(1, Math.min(textComments.length, 5));

//   // console.log(topComments);

//   const response = await c.env.AI.run("@cf/mistral/mistral-6b-instruct-v0.1", {
//     prompt: `AI, please summarize the top 6 comments from the given HackerNews thread that is : ${topComments}. Provide a concise summary, capturing the main points and arguments made by the users. Ensure that the summaries are unbiased, coherent, and maintain the original context.`,
//   });

//   console.log(response);
//   return c.json({ message: response }, 201);

const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

app.get(
  "/",
  zValidator("query", z.object({ threadUrl: z.string().refine(isValidUrl) })),
  async (c) => {
    const { threadUrl } = c.req.valid("query");
    const url = new URL(threadUrl).toString();

    const response = await fetch(url);

    const html = await response.text();

    const comments = html.match(/<div class="commtext c00">(.*?)<\/div>/g);

    if (!comments) {
      return c.text("No comments found");
    }

    const commentAstext = comments.map((comment) =>
      comment.replace(/<div class="commtext c00">|<\/div>/g, "")
    );

    // return c.text(await response.text());
    // return c.text(comments.join("\n"));
    return c.json({ comments: commentAstext });
  }
);
export default app;