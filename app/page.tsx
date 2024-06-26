import TakeInput from "./takeInput";

export const runtime = "edge";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black text-white">
      <TakeInput />
    </main>
  );
}
