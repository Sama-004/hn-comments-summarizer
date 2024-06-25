"use server";

export async function handleInput(e: FormData) {
  const hnUrl = e.get("hnUrl");

  if (!hnUrl) return;

  console.log(hnUrl);

  const response = await fetch("http://localhost:8080/?threadUrl=" + hnUrl);

  const data = (await response.json()) as { response: string };

  return data.response;
}
