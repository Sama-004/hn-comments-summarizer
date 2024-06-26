import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";

type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key];
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/*", cors());

const isValidUrl = (value: string) => {
  if (!value.startsWith("https://news.ycombinator.com")) return false;
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

    const commentsList = comments
      .map((comment) =>
        comment.replace(/<div class="commtext c00">|<\/div>/g, "")
      )
      .slice(0, 5);

    // console.log(commentsList);

    const resp = (await c.env.AI.run("@cf/mistral/mistral-7b-instruct-v0.1", {
      prompt: `summarize this set of comments which is from a website where programmers share each other ideas and projects they've built, to basically give an overview of what the users think about the post: ${commentsList.join(
        "\n"
      )} `,
    })) as { response: string };
    console.log(resp.response);
    return c.json({ response: resp.response });
  }
);
export default app;
