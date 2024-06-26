"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { handleInput } from "./actions";

function TakeInput() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <form
        className="w-full flex items-center justify-center gap-4 bg-black text-white"
        action={async (e) => {
          setSummary("");
          const response = await handleInput(e);
          console.log(response);
          if (response) setSummary(response);
        }}>
        <Input
          type="text"
          placeholder="https://news.yocombinator.com/item?id=number"
          className="full max-w-2xl bg-black text-white"
          name="hnUrl"
        />
        <Button type="submit">Summarize</Button>
      </form>

      {summary ? (
        <div className="w-full max-w-2xl bg-black text-white rounded-xl mt-10 border-10 border-white">
          {summary}
        </div>
      ) : (
        <div className="w-full max-w-2xl p-4 bg-black text-white rounded-xl mt-10 border-2 border-white">
          {loading
            ? `loading`
            : `
          use me to summarize the comments on a hacker news post so that you don't have to
          `}
        </div>
      )}
    </div>
  );
}

export default TakeInput;
