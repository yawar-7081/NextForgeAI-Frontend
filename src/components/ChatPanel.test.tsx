import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChatPanel } from "./ChatPanel";

describe("ChatPanel", () => {
  it("does not send messages when readOnly is true", () => {
    const onSendMessage = vi.fn();

    render(
      <ChatPanel
        messages={[]}
        onSendMessage={onSendMessage}
        isStreaming={false}
        readOnly={true}
      />,
    );

    const textarea = screen.getByPlaceholderText(
      "You have view-only access...",
    );
    fireEvent.change(textarea, { target: { value: "Hello" } });
    fireEvent.submit(textarea.closest("form")!);

    expect(onSendMessage).not.toHaveBeenCalled();
  });
});
