import { describe, it, expect, beforeEach, vi } from "vitest";
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

// Mock scrollIntoView for cmdk
beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe("command", () => {
  describe("Command", () => {
    it("should render without crashing", () => {
      render(<Command>Test Command</Command>);
      expect(screen.getByText("Test Command")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(<Command className="custom-class">Content</Command>);
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("should pass through other props", () => {
      const { container } = render(
        <Command data-testid="test-command">Content</Command>
      );
      expect(container.querySelector('[data-testid="test-command"]')).toBeInTheDocument();
    });

    it("should have default styling classes", () => {
      const { container } = render(<Command>Content</Command>);
      const element = container.firstChild as HTMLElement;
      expect(element.className).toContain("flex");
      expect(element.className).toContain("h-full");
      expect(element.className).toContain("w-full");
    });
  });

  describe("CommandDialog", () => {
    it("should render dialog when open", () => {
      render(
        <CommandDialog open={true}>
          <div>Dialog Content</div>
        </CommandDialog>
      );
      expect(screen.getByText("Dialog Content")).toBeInTheDocument();
    });

    it("should not render when closed", () => {
      render(
        <CommandDialog open={false}>
          <div>Dialog Content</div>
        </CommandDialog>
      );
      expect(screen.queryByText("Dialog Content")).not.toBeInTheDocument();
    });

    it("should render Command inside Dialog", () => {
      render(
        <CommandDialog open={true}>
          <div>Content</div>
        </CommandDialog>
      );
      // Dialog should contain the content
      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("CommandInput", () => {
    it("should render input element", () => {
      render(
        <Command>
          <CommandInput placeholder="Search..." />
        </Command>
      );
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    it("should have search icon", () => {
      const { container } = render(
        <Command>
          <CommandInput />
        </Command>
      );
      // Check for search icon wrapper
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <Command>
          <CommandInput className="custom-input" placeholder="test" />
        </Command>
      );
      const input = screen.getByPlaceholderText("test");
      expect(input).toHaveClass("custom-input");
    });

    it("should be wrapped in a container with border", () => {
      const { container } = render(
        <Command>
          <CommandInput />
        </Command>
      );
      const wrapper = container.querySelector('[cmdk-input-wrapper]');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("CommandList", () => {
    it("should render children", () => {
      render(
        <Command>
          <CommandList>
            <div>List Item</div>
          </CommandList>
        </Command>
      );
      expect(screen.getByText("List Item")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Command>
          <CommandList className="custom-list">
            <div>Content</div>
          </CommandList>
        </Command>
      );
      const list = container.querySelector('[cmdk-list]');
      expect(list).toHaveClass("custom-list");
    });

    it("should have scrollable overflow", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <div>Content</div>
          </CommandList>
        </Command>
      );
      const list = container.querySelector('[cmdk-list]') as HTMLElement;
      expect(list.className).toContain("overflow-y-auto");
    });

    it("should have max height constraint", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <div>Content</div>
          </CommandList>
        </Command>
      );
      const list = container.querySelector('[cmdk-list]') as HTMLElement;
      expect(list.className).toContain("max-h-");
    });
  });

  describe("CommandEmpty", () => {
    it("should render empty state message", () => {
      render(
        <Command>
          <CommandList>
            <CommandEmpty>No results found</CommandEmpty>
          </CommandList>
        </Command>
      );
      expect(screen.getByText("No results found")).toBeInTheDocument();
    });

    it("should have centered text styling", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandEmpty>Empty</CommandEmpty>
          </CommandList>
        </Command>
      );
      const empty = container.querySelector('[cmdk-empty]') as HTMLElement;
      expect(empty.className).toContain("text-center");
    });

    it("should have padding", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandEmpty>Empty</CommandEmpty>
          </CommandList>
        </Command>
      );
      const empty = container.querySelector('[cmdk-empty]') as HTMLElement;
      expect(empty.className).toContain("py-6");
    });
  });

  describe("CommandGroup", () => {
    it("should render group with children", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <div>Group Item</div>
            </CommandGroup>
          </CommandList>
        </Command>
      );
      expect(screen.getByText("Group Item")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandGroup className="custom-group">
              <div>Content</div>
            </CommandGroup>
          </CommandList>
        </Command>
      );
      const group = container.querySelector('[cmdk-group]');
      expect(group).toHaveClass("custom-group");
    });

    it("should have overflow hidden", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandGroup>
              <div>Content</div>
            </CommandGroup>
          </CommandList>
        </Command>
      );
      const group = container.querySelector('[cmdk-group]') as HTMLElement;
      expect(group.className).toContain("overflow-hidden");
    });
  });

  describe("CommandItem", () => {
    it("should render item", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>Item Content</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );
      expect(screen.getByText("Item Content")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem className="custom-item">Content</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );
      const item = container.querySelector('[cmdk-item]');
      expect(item).toHaveClass("custom-item");
    });

    it("should be selectable", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>Item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );
      const item = container.querySelector('[cmdk-item]') as HTMLElement;
      expect(item.className).toContain("select-none");
      expect(item.className).toContain("cursor-default");
    });

    it("should support disabled state via data attribute", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>Item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );
      const item = container.querySelector('[cmdk-item]') as HTMLElement;
      expect(item.className).toContain("data-[disabled=true]:pointer-events-none");
    });
  });

  describe("CommandShortcut", () => {
    it("should render shortcut text", () => {
      render(<CommandShortcut>⌘K</CommandShortcut>);
      expect(screen.getByText("⌘K")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <CommandShortcut className="custom-shortcut">⌘K</CommandShortcut>
      );
      expect(container.firstChild).toHaveClass("custom-shortcut");
    });

    it("should have monospace/tracking styles", () => {
      const { container } = render(<CommandShortcut>⌘K</CommandShortcut>);
      const element = container.firstChild as HTMLElement;
      expect(element.className).toContain("tracking-widest");
    });

    it("should be positioned at end", () => {
      const { container } = render(<CommandShortcut>⌘K</CommandShortcut>);
      const element = container.firstChild as HTMLElement;
      expect(element.className).toContain("ml-auto");
    });

    it("should have muted foreground color", () => {
      const { container } = render(<CommandShortcut>⌘K</CommandShortcut>);
      const element = container.firstChild as HTMLElement;
      expect(element.className).toContain("text-muted-foreground");
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

    it("should apply custom className", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandSeparator className="custom-separator" />
          </CommandList>
        </Command>
      );
      const separator = container.querySelector('[cmdk-separator]');
      expect(separator).toHaveClass("custom-separator");
    });

    it("should have border styling", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandSeparator />
          </CommandList>
        </Command>
      );
      const separator = container.querySelector('[cmdk-separator]') as HTMLElement;
      expect(separator.className).toContain("bg-border");
    });

    it("should be horizontal line", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandSeparator />
          </CommandList>
        </Command>
      );
      const separator = container.querySelector('[cmdk-separator]') as HTMLElement;
      expect(separator.className).toContain("h-px");
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
              <CommandItem>
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <span>Search Emoji</span>
                <CommandShortcut>⌘E</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <span>Profile</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByPlaceholderText("Type a command...")).toBeInTheDocument();
      expect(screen.getByText("Calendar")).toBeInTheDocument();
      expect(screen.getByText("Search Emoji")).toBeInTheDocument();
      expect(screen.getByText("⌘E")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
    });

    it("should render multiple command items", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>Item 1</CommandItem>
              <CommandItem>Item 2</CommandItem>
              <CommandItem>Item 3</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
    });

    it("should render nested structure correctly", () => {
      render(
        <CommandDialog open={true}>
          <CommandInput />
          <CommandList>
            <CommandGroup>
              <CommandItem>Test</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      );

      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should render as span element for CommandShortcut", () => {
      const { container } = render(<CommandShortcut>⌘K</CommandShortcut>);
      expect(container.firstChild?.nodeName).toBe("SPAN");
    });

    it("should support keyboard navigation attributes", () => {
      const { container } = render(
        <Command>
          <CommandItem>Item</CommandItem>
        </Command>
      );
      // cmdk library handles keyboard navigation
      expect(container.querySelector('[cmdk-root]')).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle empty Command", () => {
      const { container } = render(<Command />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should handle empty CommandList", () => {
      const { container } = render(
        <Command>
          <CommandList />
        </Command>
      );
      const list = container.querySelector('[cmdk-list]');
      expect(list).toBeInTheDocument();
    });

    it("should handle CommandGroup without heading", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>Item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );
      expect(screen.getByText("Item")).toBeInTheDocument();
    });

    it("should handle multiple CommandGroups", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>Group 1 Item</CommandItem>
            </CommandGroup>
            <CommandGroup>
              <CommandItem>Group 2 Item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("Group 1 Item")).toBeInTheDocument();
      expect(screen.getByText("Group 2 Item")).toBeInTheDocument();
    });

    it("should handle CommandItem with complex children", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>
                <div>
                  <strong>Title</strong>
                  <p>Description</p>
                </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
    });
  });
});