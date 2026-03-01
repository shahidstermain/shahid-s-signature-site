import { describe, it, expect } from "vitest";
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

describe("command components", () => {
  describe("Command", () => {
    it("should render without crashing", () => {
      expect(() =>
        render(
          <Command>
            <div>Content</div>
          </Command>
        )
      ).not.toThrow();
    });

    it("should render children", () => {
      render(
        <Command>
          <div data-testid="child">Test Content</div>
        </Command>
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <Command className="custom-class">Content</Command>
      );

      const element = container.querySelector(".custom-class");
      expect(element).toBeInTheDocument();
    });

    it("should forward ref correctly", () => {
      const ref = { current: null };
      render(<Command ref={ref as any}>Content</Command>);

      expect(ref.current).toBeTruthy();
    });
  });

  describe("CommandDialog", () => {
    it("should render when open", () => {
      render(
        <CommandDialog open={true}>
          <div data-testid="dialog-content">Dialog Content</div>
        </CommandDialog>
      );

      expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
    });

    it("should not render when closed", () => {
      render(
        <CommandDialog open={false}>
          <div data-testid="dialog-content">Dialog Content</div>
        </CommandDialog>
      );

      expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument();
    });

    it("should wrap children in Command component", () => {
      const { container } = render(
        <CommandDialog open={true}>
          <div data-testid="dialog-content-test">Content</div>
        </CommandDialog>
      );

      // CommandDialog wraps content in Command component
      expect(screen.getByTestId("dialog-content-test")).toBeInTheDocument();
    });
  });

  describe("CommandInput", () => {
    it("should render search icon", () => {
      render(
        <Command>
          <CommandInput placeholder="Search..." />
        </Command>
      );

      // Search icon from lucide-react should be present
      const icon = document.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it("should render with placeholder", () => {
      render(
        <Command>
          <CommandInput placeholder="Type a command..." />
        </Command>
      );

      const input = screen.getByPlaceholderText("Type a command...");
      expect(input).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      render(
        <Command>
          <CommandInput className="custom-input" placeholder="Search" />
        </Command>
      );

      const input = screen.getByPlaceholderText("Search");
      expect(input).toHaveClass("custom-input");
    });

    it("should forward ref correctly", () => {
      const ref = { current: null };
      render(
        <Command>
          <CommandInput ref={ref as any} placeholder="Search" />
        </Command>
      );

      expect(ref.current).toBeTruthy();
    });

    it("should be focusable", () => {
      render(
        <Command>
          <CommandInput placeholder="Search..." />
        </Command>
      );

      const input = screen.getByPlaceholderText("Search...");
      expect(input).not.toHaveAttribute("disabled");
    });
  });

  describe("CommandList", () => {
    it("should render children", () => {
      render(
        <Command>
          <CommandList>
            <div data-testid="list-item">Item</div>
          </CommandList>
        </Command>
      );

      expect(screen.getByTestId("list-item")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <Command>
          <CommandList className="custom-list">
            <div>Item</div>
          </CommandList>
        </Command>
      );

      const element = container.querySelector(".custom-list");
      expect(element).toBeInTheDocument();
    });

    it("should forward ref correctly", () => {
      const ref = { current: null };
      render(
        <Command>
          <CommandList ref={ref as any}>
            <div>Item</div>
          </CommandList>
        </Command>
      );

      expect(ref.current).toBeTruthy();
    });

    it("should have scrollable overflow", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <div>Item</div>
          </CommandList>
        </Command>
      );

      const list = container.querySelector('[cmdk-list]');
      expect(list).toHaveClass("overflow-y-auto");
    });
  });

  describe("CommandEmpty", () => {
    it("should render empty message", () => {
      render(
        <Command>
          <CommandList>
            <CommandEmpty>No results found</CommandEmpty>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("No results found")).toBeInTheDocument();
    });

    it("should be centered", () => {
      render(
        <Command>
          <CommandList>
            <CommandEmpty>Empty</CommandEmpty>
          </CommandList>
        </Command>
      );

      const element = screen.getByText("Empty");
      expect(element).toHaveClass("text-center");
    });

    it("should forward ref correctly", () => {
      const ref = { current: null };
      render(
        <Command>
          <CommandList>
            <CommandEmpty ref={ref as any}>Empty</CommandEmpty>
          </CommandList>
        </Command>
      );

      expect(ref.current).toBeTruthy();
    });
  });

  describe("CommandGroup", () => {
    it("should render children", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <div data-testid="group-item">Item</div>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByTestId("group-item")).toBeInTheDocument();
    });

    it("should render with heading", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup heading="Commands">
              <div>Item</div>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("Commands")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandGroup className="custom-group">
              <div>Item</div>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      const element = container.querySelector(".custom-group");
      expect(element).toBeInTheDocument();
    });

    it("should forward ref correctly", () => {
      const ref = { current: null };
      render(
        <Command>
          <CommandList>
            <CommandGroup ref={ref as any}>
              <div>Item</div>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(ref.current).toBeTruthy();
    });
  });

  describe("CommandItem", () => {
    it("should render item text", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>Select item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("Select item")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem className="custom-item">Item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      const element = container.querySelector(".custom-item");
      expect(element).toBeInTheDocument();
    });

    it("should forward ref correctly", () => {
      const ref = { current: null };
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem ref={ref as any}>Item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(ref.current).toBeTruthy();
    });

    it("should be selectable by default", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>Selectable</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      const item = screen.getByText("Selectable");
      expect(item).toHaveClass("cursor-default");
    });
  });

  describe("CommandShortcut", () => {
    it("should render shortcut text", () => {
      render(<CommandShortcut>⌘K</CommandShortcut>);

      expect(screen.getByText("⌘K")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      render(<CommandShortcut className="custom-shortcut">Ctrl+C</CommandShortcut>);

      const element = screen.getByText("Ctrl+C");
      expect(element).toHaveClass("custom-shortcut");
    });

    it("should have muted appearance", () => {
      render(<CommandShortcut>⌘V</CommandShortcut>);

      const element = screen.getByText("⌘V");
      expect(element).toHaveClass("text-muted-foreground");
    });

    it("should align to the right", () => {
      render(<CommandShortcut>⌘S</CommandShortcut>);

      const element = screen.getByText("⌘S");
      expect(element).toHaveClass("ml-auto");
    });
  });

  describe("CommandSeparator", () => {
    it("should render separator", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandSeparator />
          </CommandList>
        </Command>
      );

      const separator = container.querySelector('[cmdk-separator]');
      expect(separator).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandSeparator className="custom-separator" />
          </CommandList>
        </Command>
      );

      const element = container.querySelector(".custom-separator");
      expect(element).toBeInTheDocument();
    });

    it("should forward ref correctly", () => {
      const ref = { current: null };
      render(
        <Command>
          <CommandList>
            <CommandSeparator ref={ref as any} />
          </CommandList>
        </Command>
      );

      expect(ref.current).toBeTruthy();
    });

    it("should have border styling", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandSeparator />
          </CommandList>
        </Command>
      );

      const separator = container.querySelector('[cmdk-separator]');
      expect(separator).toHaveClass("bg-border");
    });
  });

  describe("integration tests", () => {
    it("should render complete command menu structure", () => {
      render(
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                Calendar
                <CommandShortcut>⌘K</CommandShortcut>
              </CommandItem>
              <CommandItem>
                Search
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>Profile</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
      expect(screen.getByText("Suggestions")).toBeInTheDocument();
      expect(screen.getByText("Calendar")).toBeInTheDocument();
      expect(screen.getByText("⌘K")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
    });

    it("should work with CommandDialog wrapper", () => {
      render(
        <CommandDialog open={true}>
          <CommandInput placeholder="Type a command..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Actions">
              <CommandItem>Action 1</CommandItem>
              <CommandItem>Action 2</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      );

      expect(screen.getByPlaceholderText("Type a command...")).toBeInTheDocument();
      expect(screen.getByText("Actions")).toBeInTheDocument();
      expect(screen.getByText("Action 1")).toBeInTheDocument();
      expect(screen.getByText("Action 2")).toBeInTheDocument();
    });

    it("should handle multiple command groups", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup heading="Group 1">
              <CommandItem>Item 1</CommandItem>
            </CommandGroup>
            <CommandGroup heading="Group 2">
              <CommandItem>Item 2</CommandItem>
            </CommandGroup>
            <CommandGroup heading="Group 3">
              <CommandItem>Item 3</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("Group 1")).toBeInTheDocument();
      expect(screen.getByText("Group 2")).toBeInTheDocument();
      expect(screen.getByText("Group 3")).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
    });

    it("should render items with multiple shortcuts", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>
                Save File
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("Save File")).toBeInTheDocument();
      expect(screen.getByText("⌘S")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle empty command list", () => {
      render(
        <Command>
          <CommandList>
            <CommandEmpty>No items</CommandEmpty>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("No items")).toBeInTheDocument();
    });

    it("should handle command without input", () => {
      expect(() =>
        render(
          <Command>
            <CommandList>
              <CommandItem>Item</CommandItem>
            </CommandList>
          </Command>
        )
      ).not.toThrow();
    });

    it("should handle command group without heading", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>Unheaded item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("Unheaded item")).toBeInTheDocument();
    });

    it("should handle nested command structures", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>
                <div>
                  <span>Complex item</span>
                  <CommandShortcut>⌘K</CommandShortcut>
                </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("Complex item")).toBeInTheDocument();
      expect(screen.getByText("⌘K")).toBeInTheDocument();
    });
  });
});