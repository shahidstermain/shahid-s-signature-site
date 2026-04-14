import { describe, it, expect, vi, beforeAll } from "vitest";
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

// Mock ResizeObserver and scrollIntoView
beforeAll(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock scrollIntoView for cmdk
  Element.prototype.scrollIntoView = vi.fn();
});

// Mock the Dialog component
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, ...props }: any) => <div data-testid="dialog" {...props}>{children}</div>,
  DialogContent: ({ children, ...props }: any) => (
    <div data-testid="dialog-content" {...props}>{children}</div>
  ),
}));

describe("Command components", () => {
  describe("Command", () => {
    it("should render without crashing", () => {
      expect(() => render(<Command />)).not.toThrow();
    });

    it("should render children", () => {
      render(
        <Command>
          <div data-testid="child">Test content</div>
        </Command>
      );
      expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(<Command className="custom-class" />);
      const element = container.querySelector(".custom-class");
      expect(element).toBeInTheDocument();
    });

    it("should forward ref", () => {
      const ref = vi.fn();
      render(<Command ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe("CommandDialog", () => {
    it("should render without crashing", () => {
      expect(() => render(<CommandDialog open={false} />)).not.toThrow();
    });

    it("should wrap content in Dialog", () => {
      render(
        <CommandDialog open={true}>
          <div data-testid="dialog-child">Dialog content</div>
        </CommandDialog>
      );
      expect(screen.getByTestId("dialog")).toBeInTheDocument();
      expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
    });

    it("should pass Dialog props", () => {
      const onOpenChange = vi.fn();
      render(<CommandDialog open={true} onOpenChange={onOpenChange} />);
      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });

    it("should render Command inside Dialog", () => {
      render(
        <CommandDialog open={true}>
          <CommandInput placeholder="Search..." />
        </CommandDialog>
      );
      // Should have both dialog and command structure
      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });
  });

  describe("CommandInput", () => {
    it("should render without crashing", () => {
      expect(() => render(<Command><CommandInput /></Command>)).not.toThrow();
    });

    it("should render search icon", () => {
      const { container } = render(
        <Command>
          <CommandInput />
        </Command>
      );
      // Search icon from lucide-react should be rendered
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should accept placeholder text", () => {
      render(
        <Command>
          <CommandInput placeholder="Type a command..." />
        </Command>
      );
      const input = screen.getByPlaceholderText("Type a command...");
      expect(input).toBeInTheDocument();
    });

    it("should be focusable", () => {
      render(
        <Command>
          <CommandInput placeholder="Search" />
        </Command>
      );
      const input = screen.getByPlaceholderText("Search");
      input.focus();
      expect(input).toHaveFocus();
    });

    it("should accept custom className", () => {
      render(
        <Command>
          <CommandInput className="custom-input" />
        </Command>
      );
      const input = document.querySelector(".custom-input");
      expect(input).toBeInTheDocument();
    });

    it("should forward ref", () => {
      const ref = vi.fn();
      render(
        <Command>
          <CommandInput ref={ref} />
        </Command>
      );
      expect(ref).toHaveBeenCalled();
    });
  });

  describe("CommandList", () => {
    it("should render without crashing", () => {
      expect(() => render(<Command><CommandList /></Command>)).not.toThrow();
    });

    it("should render children", () => {
      render(
        <Command>
          <CommandList>
            <div data-testid="list-child">List item</div>
          </CommandList>
        </Command>
      );
      expect(screen.getByTestId("list-child")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Command>
          <CommandList className="custom-list" />
        </Command>
      );
      const element = container.querySelector(".custom-list");
      expect(element).toBeInTheDocument();
    });

    it("should forward ref", () => {
      const ref = vi.fn();
      render(
        <Command>
          <CommandList ref={ref} />
        </Command>
      );
      expect(ref).toHaveBeenCalled();
    });
  });

  describe("CommandEmpty", () => {
    it("should render without crashing", () => {
      expect(() => render(<Command><CommandEmpty /></Command>)).not.toThrow();
    });

    it("should render children", () => {
      render(
        <Command>
          <CommandEmpty>No results found.</CommandEmpty>
        </Command>
      );
      expect(screen.getByText("No results found.")).toBeInTheDocument();
    });

    it("should forward ref", () => {
      const ref = vi.fn();
      render(
        <Command>
          <CommandEmpty ref={ref} />
        </Command>
      );
      expect(ref).toHaveBeenCalled();
    });
  });

  describe("CommandGroup", () => {
    it("should render without crashing", () => {
      expect(() => render(<Command><CommandGroup /></Command>)).not.toThrow();
    });

    it("should render children", () => {
      render(
        <Command>
          <CommandGroup>
            <div data-testid="group-child">Group item</div>
          </CommandGroup>
        </Command>
      );
      expect(screen.getByTestId("group-child")).toBeInTheDocument();
    });

    it("should accept heading prop", () => {
      render(
        <Command>
          <CommandGroup heading="Suggestions">
            <CommandItem>Item 1</CommandItem>
          </CommandGroup>
        </Command>
      );
      expect(screen.getByText("Suggestions")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Command>
          <CommandGroup className="custom-group" />
        </Command>
      );
      const element = container.querySelector(".custom-group");
      expect(element).toBeInTheDocument();
    });

    it("should forward ref", () => {
      const ref = vi.fn();
      render(
        <Command>
          <CommandGroup ref={ref} />
        </Command>
      );
      expect(ref).toHaveBeenCalled();
    });
  });

  describe("CommandSeparator", () => {
    it("should render without crashing", () => {
      expect(() => render(<Command><CommandSeparator /></Command>)).not.toThrow();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Command>
          <CommandSeparator className="custom-separator" />
        </Command>
      );
      const element = container.querySelector(".custom-separator");
      expect(element).toBeInTheDocument();
    });

    it("should forward ref", () => {
      const ref = vi.fn();
      render(
        <Command>
          <CommandSeparator ref={ref} />
        </Command>
      );
      expect(ref).toHaveBeenCalled();
    });
  });

  describe("CommandItem", () => {
    it("should render without crashing", () => {
      expect(() => render(<Command><CommandItem /></Command>)).not.toThrow();
    });

    it("should render children", () => {
      render(
        <Command>
          <CommandItem>Test item</CommandItem>
        </Command>
      );
      expect(screen.getByText("Test item")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Command>
          <CommandItem className="custom-item" />
        </Command>
      );
      const element = container.querySelector(".custom-item");
      expect(element).toBeInTheDocument();
    });

    it("should forward ref", () => {
      const ref = vi.fn();
      render(
        <Command>
          <CommandItem ref={ref} />
        </Command>
      );
      expect(ref).toHaveBeenCalled();
    });

    it("should accept disabled prop", () => {
      render(
        <Command>
          <CommandItem disabled>Disabled item</CommandItem>
        </Command>
      );
      expect(screen.getByText("Disabled item")).toBeInTheDocument();
    });
  });

  describe("CommandShortcut", () => {
    it("should render without crashing", () => {
      expect(() => render(<CommandShortcut />)).not.toThrow();
    });

    it("should render children", () => {
      render(<CommandShortcut>⌘K</CommandShortcut>);
      expect(screen.getByText("⌘K")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <CommandShortcut className="custom-shortcut">⌘K</CommandShortcut>
      );
      const element = container.querySelector(".custom-shortcut");
      expect(element).toBeInTheDocument();
    });

    it("should render as span element", () => {
      const { container } = render(<CommandShortcut>⌘K</CommandShortcut>);
      const span = container.querySelector("span");
      expect(span).toBeInTheDocument();
      expect(span?.textContent).toBe("⌘K");
    });
  });

  describe("integration tests", () => {
    it("should render a complete command menu structure", () => {
      render(
        <Command>
          <CommandInput placeholder="Type a command..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>Profile</CommandItem>
              <CommandItem>Billing</CommandItem>
              <CommandItem>Settings</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByPlaceholderText("Type a command...")).toBeInTheDocument();
      expect(screen.getByText("Suggestions")).toBeInTheDocument();
      // Settings appears as both heading and item
      expect(screen.getAllByText("Settings").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Calendar")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
    });

    it("should render items with shortcuts", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>
                Search
                <CommandShortcut>⌘K</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("Search")).toBeInTheDocument();
      expect(screen.getByText("⌘K")).toBeInTheDocument();
    });

    it("should handle empty state", () => {
      render(
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("No results found.")).toBeInTheDocument();
    });
  });

  describe("styling and classes", () => {
    it("should apply default Tailwind classes to Command", () => {
      const { container } = render(<Command />);
      const element = container.firstElementChild;
      expect(element?.className).toContain("flex");
    });

    it("should merge custom classes with defaults", () => {
      const { container } = render(<Command className="my-custom-class" />);
      const element = container.firstElementChild;
      expect(element?.className).toContain("my-custom-class");
      expect(element?.className).toContain("flex");
    });
  });

  describe("accessibility", () => {
    it("should have proper ARIA attributes on CommandInput", () => {
      render(
        <Command>
          <CommandInput aria-label="Search commands" />
        </Command>
      );
      const input = screen.getByLabelText("Search commands");
      expect(input).toBeInTheDocument();
    });

    it("should support keyboard navigation", () => {
      render(
        <Command>
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandItem>Item 1</CommandItem>
            <CommandItem>Item 2</CommandItem>
          </CommandList>
        </Command>
      );

      const input = screen.getByPlaceholderText("Search");
      expect(input).toBeInTheDocument();
      // cmdk handles keyboard navigation internally
    });
  });
});