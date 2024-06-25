"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { handleInput } from "./actions";

function TakeInput() {
  return (
    <form
      className="w-full flex items-center justify-center gap-4"
      action={async (e) => {
        const response = await handleInput(e);
        console.log(response);
      }}>
      <Input
        type="text"
        placeholder="https://news.yocombinator.com/"
        className="full max-w-2xl"
        name="hnUrl"
      />
      <Button type="submit">Summarize</Button>
    </form>
  );
}

export default TakeInput;
