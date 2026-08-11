import { describe, it, expect } from "vitest";
import { extractFileUpdates } from "./api";

describe("extractFileUpdates", () => {
  it("parses streamed file edits from SSE content", () => {
    const updates = extractFileUpdates(
      '<file path="src/App.tsx">export const App = () => </file>',
    );

    expect(updates).toEqual([
      {
        path: "src/App.tsx",
        content: "export const App = () => ",
      },
    ]);
  });
});
