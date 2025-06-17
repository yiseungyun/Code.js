import { rest } from "msw";
import { userData } from "./userData";
import type { User } from "../types";
import Hangul from 'hangul-js';

export const handlers = [
  rest.get("/api/users", (req, res, ctx) => {
    const search = req.url.searchParams.get("search") || "";
    const sort = req.url.searchParams.get("sort") as keyof User || "name";
    const order = req.url.searchParams.get("order") || "asc";

    const filteredUsers = userData.filter(user => {
      const disassembledSearch = Hangul.disassemble(search).join("");
      const disassembledName = Hangul.disassemble(user.name).join("");

      return disassembledName.includes(disassembledSearch);
    });

    const sortedUsers = filteredUsers.sort((a, b) => {
      const aValue = a[sort];
      const bValue = b[sort];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return 0;
    });

    return res(
      ctx.status(200),
      ctx.json(sortedUsers)
    );
  }),
];