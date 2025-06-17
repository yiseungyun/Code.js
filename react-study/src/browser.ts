import { setupWorker } from "msw";
import { handlers as handlersDay1 } from "./code/day01/models/handlers";

export const worker = setupWorker(
  ...handlersDay1
);