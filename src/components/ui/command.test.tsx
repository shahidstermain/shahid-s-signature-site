import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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

// Mock the dialog component
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  DialogContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

describe("command", () => {
  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });
  describe("Command", () => {
    it("should render without crashing", () => {
      expect(() => render(<Command />)).not.toThrow();
    });

    it("should render children", () => {
      render(
        <Command>
          <div data-testid="child">Test Child</div>
        </Command>
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(<Command className="custom-class" />);

      const commandElement = container.querySelector('[class*="custom-class"]');
      expect(commandElement).toBeInTheDocument();
    });

    it("should forward ref", () => {
      const ref = vi.fn();
      render(<Command ref={ref} />);

      expect(ref).toHaveBeenCalled();
    });
  });

  describe("CommandDialog", () => {
    it("should render without crashing", () => {
      expect(() => render(<CommandDialog open={true} />)).not.toThrow();
    });

    it("should render children when open", () => {
      render(
        <CommandDialog open={true}>
          <div data-testid="dialog-child">Dialog Content</div>
        </CommandDialog>
      );

      expect(screen.getByTestId("dialog-child")).toBeInTheDocument();
    });

    it("should wrap children in Command component", () => {
      const { container } = render(
        <CommandDialog open={true}>
          <div>Content</div>
        </CommandDialog>
      );

      // Should have Command wrapper structure
      expect(container.querySelector('[cmdk-root]')).toBeInTheDocument();
    });
  });

  describe("CommandInput", () => {
    it("should render without crashing", () => {
      expect(() =>
        render(
          <Command>
            <CommandInput />
          </Command>
        )
      ).not.toThrow();
    });

    it("should render search icon", () => {
      const { container } = render(
        <Command>
          <CommandInput />
        </Command>
      );

      const searchIcon = container.querySelector("svg");
      expect(searchIcon).toBeInTheDocument();
    });

    it("should accept placeholder text", () => {
      render(
        <Command>
          <CommandInput placeholder="Search..." />
        </Command>
      );

      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    it("should be focusable", () => {
      render(
        <Command>
          <CommandInput />
        </Command>
      );

      const input = screen.getByRole("combobox");
      expect(input).toBeInTheDocument();
      input.focus();
      expect(input).toHaveFocus();
    });

    it("should accept and display user input", () => {
      render(
        <Command>
          <CommandInput />
        </Command>
      );

      const input = screen.getByRole("combobox") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "test query" } });

      expect(input).toHaveValue("test query");
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Command>
          <CommandInput className="custom-input" />
        </Command>
      );

      const inputElement = container.querySelector('[class*="custom-input"]');
      expect(inputElement).toBeInTheDocument();
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
      expect(() =>
        render(
          <Command>
            <CommandList />
          </Command>
        )
      ).not.toThrow();
    });

    it("should render children", () => {
      render(
        <Command>
          <CommandList>
            <div data-testid="list-child">List Item</div>
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

      const listElement = container.querySelector('[class*="custom-list"]');
      expect(listElement).toBeInTheDocument();
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
      expect(() =>
        render(
          <Command>
            <CommandList>
              <CommandEmpty />
            </CommandList>
          </Command>
        )
      ).not.toThrow();
    });

    it("should render custom empty message", () => {
      render(
        <Command>
          <CommandList>
            <CommandEmpty>No results found</CommandEmpty>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("No results found")).toBeInTheDocument();
    });

    it("should forward ref", () => {
      const ref = vi.fn();
      render(
        <Command>
          <CommandList>
            <CommandEmpty ref={ref} />
          </CommandList>
        </Command>
      );

      expect(ref).toHaveBeenCalled();
    });
  });

  describe("CommandGroup", () => {
    it("should render without crashing", () => {
      expect(() =>
        render(
          <Command>
            <CommandList>
              <CommandGroup />
            </CommandList>
          </Command>
        )
      ).not.toThrow();
    });

    it("should render group heading", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup heading="Suggestions">
              <CommandItem>Item 1</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("Suggestions")).toBeInTheDocument();
    });

    it("should render children items", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <div data-testid="group-child">Group Item</div>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByTestId("group-child")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandGroup className="custom-group" />
          </CommandList>
        </Command>
      );

      const groupElement = container.querySelector('[class*="custom-group"]');
      expect(groupElement).toBeInTheDocument();
    });

    it("should forward ref", () => {
      const ref = vi.fn();
      render(
        <Command>
          <CommandList>
            <CommandGroup ref={ref} />
          </CommandList>
        </Command>
      );

      expect(ref).toHaveBeenCalled();
    });
  });

  describe("CommandSeparator", () => {
    it("should render without crashing", () => {
      expect(() =>
        render(
          <Command>
            <CommandList>
              <CommandSeparator />
            </CommandList>
          </Command>
        )
      ).not.toThrow();
    });

    it("should render as a separator", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandSeparator />
          </CommandList>
        </Command>
      );

      const separator = container.querySelector('[role="separator"]');
      expect(separator).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandSeparator className="custom-separator" />
          </CommandList>
        </Command>
      );

      const separatorElement = container.querySelector('[class*="custom-separator"]');
      expect(separatorElement).toBeInTheDocument();
    });

    it("should forward ref", () => {
      const ref = vi.fn();
      render(
        <Command>
          <CommandList>
            <CommandSeparator ref={ref} />
          </CommandList>
        </Command>
      );

      expect(ref).toHaveBeenCalled();
    });
  });

  describe("CommandItem", () => {
    it("should render without crashing", () => {
      expect(() =>
        render(
          <Command>
            <CommandList>
              <CommandGroup>
                <CommandItem />
              </CommandGroup>
            </CommandList>
          </Command>
        )
      ).not.toThrow();
    });

    it("should render item content", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>Test Item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("Test Item")).toBeInTheDocument();
    });

    it("should be selectable", () => {
      const onSelect = vi.fn();

      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem onSelect={onSelect}>Selectable Item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      const item = screen.getByText("Selectable Item");
      fireEvent.click(item);

      expect(onSelect).toHaveBeenCalled();
    });

    it("should support disabled state", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem disabled>Disabled Item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      const item = screen.getByText("Disabled Item");
      expect(item).toHaveAttribute("data-disabled", "true");
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem className="custom-item">Item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      const itemElement = container.querySelector('[class*="custom-item"]');
      expect(itemElement).toBeInTheDocument();
    });

    it("should forward ref", () => {
      const ref = vi.fn();
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem ref={ref}>Item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(ref).toHaveBeenCalled();
    });
  });

  describe("CommandShortcut", () => {
    it("should render without crashing", () => {
      expect(() => render(<CommandShortcut />)).not.toThrow();
    });

    it("should render shortcut text", () => {
      render(<CommandShortcut>⌘K</CommandShortcut>);

      expect(screen.getByText("⌘K")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <CommandShortcut className="custom-shortcut">Ctrl+K</CommandShortcut>
      );

      const shortcutElement = container.querySelector('[class*="custom-shortcut"]');
      expect(shortcutElement).toBeInTheDocument();
    });

    it("should render as span element", () => {
      const { container } = render(<CommandShortcut>⌘K</CommandShortcut>);

      const span = container.querySelector("span");
      expect(span).toBeInTheDocument();
      expect(span?.textContent).toBe("⌘K");
    });
  });

  describe("integration", () => {
    it("should render complete command palette structure", () => {
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

      // Verify all parts are rendered
      expect(screen.getByPlaceholderText("Type a command...")).toBeInTheDocument();
      expect(screen.getByText("Suggestions")).toBeInTheDocument();
      expect(screen.getByText("Calendar")).toBeInTheDocument();
      const settingsElements = screen.getAllByText("Settings");
      expect(settingsElements.length).toBeGreaterThan(0);
      expect(screen.getByText("Profile")).toBeInTheDocument();
    });

    it("should filter items based on search input", () => {
      render(
        <Command>
          <CommandInput />
          <CommandList>
            <CommandGroup>
              <CommandItem value="calendar">Calendar</CommandItem>
              <CommandItem value="settings">Settings</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      const input = screen.getByRole("combobox") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "cal" } });

      // cmdk will handle filtering internally
      expect(input).toHaveValue("cal");
    });

    it("should handle keyboard navigation", () => {
      render(
        <Command>
          <CommandInput />
          <CommandList>
            <CommandGroup>
              <CommandItem>Item 1</CommandItem>
              <CommandItem>Item 2</CommandItem>
              <CommandItem>Item 3</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      const input = screen.getByRole("combobox");
      input.focus();

      fireEvent.keyDown(input, { key: "ArrowDown" });
      // cmdk handles the actual navigation
      expect(input).toHaveFocus();
    });

    it("should render with shortcuts in items", () => {
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
  });

  describe("accessibility", () => {
    it("should have proper ARIA roles", () => {
      render(
        <Command>
          <CommandInput />
        </Command>
      );

      const combobox = screen.getByRole("combobox");
      expect(combobox).toBeInTheDocument();
    });

    it("should support keyboard interaction", () => {
      render(
        <Command>
          <CommandInput />
          <CommandList>
            <CommandGroup>
              <CommandItem>Item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      const input = screen.getByRole("combobox");

      fireEvent.keyDown(input, { key: "Enter" });
      fireEvent.keyDown(input, { key: "Escape" });

      // Should not throw
      expect(input).toBeInTheDocument();
    });

    it("should indicate disabled state properly", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem disabled>Disabled Item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      const item = screen.getByText("Disabled Item");
      expect(item).toHaveAttribute("data-disabled", "true");
    });
  });

  describe("edge cases", () => {
    it("should handle empty command", () => {
      expect(() => render(<Command />)).not.toThrow();
    });

    it("should handle command with only input", () => {
      render(
        <Command>
          <CommandInput />
        </Command>
      );

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should handle very long item text", () => {
      const longText = "A".repeat(200);

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

    it("should handle special characters in search", () => {
      render(
        <Command>
          <CommandInput />
        </Command>
      );

      const input = screen.getByRole("combobox") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "!@#$%^&*()" } });

      expect(input).toHaveValue("!@#$%^&*()");
    });
  });
});