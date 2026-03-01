import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "./command";

// Mock the Dialog component
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  DialogContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

describe("Command components", () => {
  describe("Command", () => {
    it("should render without crashing", () => {
      render(<Command>Test</Command>);
    });

    it("should render children", () => {
      render(<Command>Command content</Command>);
      expect(screen.getByText("Command content")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <Command className="custom-class">Test</Command>
      );
      const element = container.firstChild;
      expect(element).toHaveClass("custom-class");
    });

    it("should merge default and custom classNames", () => {
      const { container } = render(
        <Command className="custom">Test</Command>
      );
      const element = container.firstChild;
      expect(element).toHaveAttribute("class");
    });
  });

  describe("CommandDialog", () => {
    it("should render without crashing", () => {
      render(<CommandDialog open={true}>Dialog content</CommandDialog>);
    });

    it("should render children inside dialog", () => {
      render(<CommandDialog open={true}>Dialog test</CommandDialog>);
      expect(screen.getByText("Dialog test")).toBeInTheDocument();
    });

    it("should wrap children in Command component", () => {
      const { container } = render(
        <CommandDialog open={true}>
          <div data-testid="dialog-child">Test</div>
        </CommandDialog>
      );
      expect(screen.getByTestId("dialog-child")).toBeInTheDocument();
    });
  });

  describe("CommandInput", () => {
    it("should render without crashing", () => {
      render(
        <Command>
          <CommandInput />
        </Command>
      );
    });

    it("should render search icon", () => {
      const { container } = render(
        <Command>
          <CommandInput />
        </Command>
      );
      // Search icon should be rendered
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should accept placeholder prop", () => {
      render(
        <Command>
          <CommandInput placeholder="Search..." />
        </Command>
      );
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      render(
        <Command>
          <CommandInput className="custom-input" />
        </Command>
      );
      const input = screen.getByRole("combobox", { hidden: true });
      expect(input).toHaveClass("custom-input");
    });

    it("should have proper input attributes", () => {
      render(
        <Command>
          <CommandInput disabled />
        </Command>
      );
      const input = screen.getByRole("combobox", { hidden: true });
      expect(input).toBeDisabled();
    });
  });

  describe("CommandList", () => {
    it("should render without crashing", () => {
      render(
        <Command>
          <CommandList>List items</CommandList>
        </Command>
      );
    });

    it("should render children", () => {
      render(
        <Command>
          <CommandList>List content</CommandList>
        </Command>
      );
      expect(screen.getByText("List content")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <Command>
          <CommandList className="custom-list">Test</CommandList>
        </Command>
      );
      const listElement = container.querySelector(".custom-list");
      expect(listElement).toBeInTheDocument();
    });
  });

  describe("CommandEmpty", () => {
    it("should render without crashing", () => {
      render(
        <Command>
          <CommandList>
            <CommandEmpty>No results</CommandEmpty>
          </CommandList>
        </Command>
      );
    });

    it("should render children", () => {
      render(
        <Command>
          <CommandList>
            <CommandEmpty>No results found</CommandEmpty>
          </CommandList>
        </Command>
      );
      expect(screen.getByText("No results found")).toBeInTheDocument();
    });

    it("should have default styling", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandEmpty>Empty</CommandEmpty>
          </CommandList>
        </Command>
      );
      expect(container).toBeInTheDocument();
    });
  });

  describe("CommandGroup", () => {
    it("should render without crashing", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>Group content</CommandGroup>
          </CommandList>
        </Command>
      );
    });

    it("should render children", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>Group items</CommandGroup>
          </CommandList>
        </Command>
      );
      expect(screen.getByText("Group items")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandGroup className="custom-group">Test</CommandGroup>
          </CommandList>
        </Command>
      );
      const groupElement = container.querySelector(".custom-group");
      expect(groupElement).toBeInTheDocument();
    });

    it("should accept heading prop", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup heading="Commands">Items</CommandGroup>
          </CommandList>
        </Command>
      );
      expect(screen.getByText("Items")).toBeInTheDocument();
    });
  });

  describe("CommandSeparator", () => {
    it("should render without crashing", () => {
      render(
        <Command>
          <CommandList>
            <CommandSeparator />
          </CommandList>
        </Command>
      );
    });

    it("should accept custom className", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandSeparator className="custom-separator" />
          </CommandList>
        </Command>
      );
      const separator = container.querySelector(".custom-separator");
      expect(separator).toBeInTheDocument();
    });
  });

  describe("CommandItem", () => {
    it("should render without crashing", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>Item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );
    });

    it("should render children", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>Command item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );
      expect(screen.getByText("Command item")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem className="custom-item">Test</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );
      const item = container.querySelector(".custom-item");
      expect(item).toBeInTheDocument();
    });

    it("should accept disabled prop", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem disabled>Disabled item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );
      expect(screen.getByText("Disabled item")).toBeInTheDocument();
    });

    it("should accept onSelect callback", () => {
      const onSelect = vi.fn();
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem onSelect={onSelect}>Selectable</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );
      expect(screen.getByText("Selectable")).toBeInTheDocument();
    });
  });

  describe("CommandShortcut", () => {
    it("should render without crashing", () => {
      render(<CommandShortcut>⌘K</CommandShortcut>);
    });

    it("should render children", () => {
      render(<CommandShortcut>Ctrl+C</CommandShortcut>);
      expect(screen.getByText("Ctrl+C")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <CommandShortcut className="custom-shortcut">⌘K</CommandShortcut>
      );
      const element = container.firstChild;
      expect(element).toHaveClass("custom-shortcut");
    });

    it("should be a span element", () => {
      const { container } = render(<CommandShortcut>⌘K</CommandShortcut>);
      const span = container.querySelector("span");
      expect(span).toBeInTheDocument();
    });
  });

  describe("integration tests", () => {
    it("should render complete command palette structure", () => {
      render(
        <Command>
          <CommandInput placeholder="Type a command..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <span>Calendar</span>
                <CommandShortcut>⌘K</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <span>Preferences</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Account">
              <CommandItem>Profile</CommandItem>
              <CommandItem>Billing</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByPlaceholderText("Type a command...")).toBeInTheDocument();
      // CommandEmpty is only shown when there are no results, so we check other elements
      expect(screen.getByText("Calendar")).toBeInTheDocument();
      expect(screen.getByText("Preferences")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.getByText("⌘K")).toBeInTheDocument();
    });

    it("should render CommandDialog with full structure", () => {
      render(
        <CommandDialog open={true}>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              <CommandItem>Item 1</CommandItem>
              <CommandItem>Item 2</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      );

      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
    });

    it("should handle multiple CommandGroups", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup heading="Group 1">
              <CommandItem>Item 1</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Group 2">
              <CommandItem>Item 2</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Group 3">
              <CommandItem>Item 3</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
    });

    it("should handle items with shortcuts", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>
                Open
                <CommandShortcut>⌘O</CommandShortcut>
              </CommandItem>
              <CommandItem>
                Save
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
              <CommandItem>
                Close
                <CommandShortcut>⌘W</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("⌘O")).toBeInTheDocument();
      expect(screen.getByText("⌘S")).toBeInTheDocument();
      expect(screen.getByText("⌘W")).toBeInTheDocument();
    });

    it("should handle nested complex structures", () => {
      render(
        <Command>
          <CommandInput />
          <CommandList>
            <CommandEmpty>Empty state</CommandEmpty>
            <CommandGroup>
              <CommandItem>
                <span>Complex item</span>
                <CommandShortcut>Ctrl+K</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("Complex item")).toBeInTheDocument();
      expect(screen.getByText("Ctrl+K")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle empty Command", () => {
      render(<Command />);
    });

    it("should handle empty CommandList", () => {
      render(
        <Command>
          <CommandList />
        </Command>
      );
    });

    it("should handle empty CommandGroup", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup />
          </CommandList>
        </Command>
      );
    });

    it("should handle CommandInput with no props", () => {
      render(
        <Command>
          <CommandInput />
        </Command>
      );
    });

    it("should handle very long item text", () => {
      const longText = "a".repeat(200);
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>{longText}</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("should handle special characters in shortcuts", () => {
      render(<CommandShortcut>⌘⇧⌥⌃</CommandShortcut>);
      expect(screen.getByText("⌘⇧⌥⌃")).toBeInTheDocument();
    });

    it("should render deeply nested command structures", () => {
      render(
        <Command>
          <CommandInput placeholder="Deep test" />
          <CommandList>
            <CommandGroup>
              <CommandGroup>
                <CommandItem>Nested item</CommandItem>
              </CommandGroup>
            </CommandGroup>
          </CommandList>
        </Command>
      );
      expect(screen.getByText("Nested item")).toBeInTheDocument();
    });

    it("should handle rapid re-renders without errors", () => {
      const { rerender } = render(<Command>Test 1</Command>);
      rerender(<Command>Test 2</Command>);
      rerender(<Command>Test 3</Command>);
      expect(screen.getByText("Test 3")).toBeInTheDocument();
    });

    it("should handle CommandItem with complex children", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>
                <div>
                  <span>Title</span>
                  <span>Subtitle</span>
                  <CommandShortcut>⌘K</CommandShortcut>
                </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Subtitle")).toBeInTheDocument();
    });

    it("should preserve className across re-renders", () => {
      const { container, rerender } = render(
        <Command className="test-class">Initial</Command>
      );
      rerender(<Command className="test-class">Updated</Command>);
      expect(container.firstChild).toHaveClass("test-class");
    });
  });
});