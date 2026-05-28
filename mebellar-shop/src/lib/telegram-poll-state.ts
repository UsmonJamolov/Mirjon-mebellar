import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const STATE_PATH = path.join(process.cwd(), "data", "telegram-poll.json");

interface PollState {
  lastUpdateId: number;
}

let memoryState: PollState | null = null;

export async function getLastUpdateId(): Promise<number> {
  if (memoryState) return memoryState.lastUpdateId;
  try {
    const raw = await readFile(STATE_PATH, "utf-8");
    const data = JSON.parse(raw) as PollState;
    memoryState = data;
    return data.lastUpdateId ?? 0;
  } catch {
    memoryState = { lastUpdateId: 0 };
    return 0;
  }
}

export async function setLastUpdateId(id: number): Promise<void> {
  memoryState = { lastUpdateId: id };
  try {
    await mkdir(path.dirname(STATE_PATH), { recursive: true });
    await writeFile(STATE_PATH, JSON.stringify(memoryState, null, 2), "utf-8");
  } catch (e) {
    console.warn("Telegram poll state write error:", e);
  }
}
