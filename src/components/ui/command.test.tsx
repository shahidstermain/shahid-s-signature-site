import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Command,
  CommandDialog,
  CommandShortcut,
} from "./command";

// Mock Dialog component
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, ...props }: any) => <div data-testid="dialog" {...props}>{children}</div>,
  DialogContent: ({ children, ...props }: any) => <div data-testid="dialog-content" {...props}>{children}</div>,
}));

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

describe("Command", () => {
  describe("Command component", () => {
    it("should render command component", () => {
      const { container } = render(
        <Command>
          <div>Test content</div>
        </Command>
      );

      expect(container.querySelector('[cmdk-root]')).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Command className="custom-class">
          <div>Test</div>
        </Command>
      );

      const element = container.querySelector('[cmdk-root]');
      expect(element?.className).toContain("custom-class");
    });

    it("should render children", () => {
      render(
        <Command>
          <div data-testid="child">Child content</div>
        </Command>
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("should have correct base classes", () => {
      const { container } = render(
        <Command>
          <div>Test</div>
        </Command>
      );

      const element = container.querySelector('[cmdk-root]');
      expect(element?.className).toContain("flex");
      expect(element?.className).toContain("h-full");
      expect(element?.className).toContain("w-full");
    });

    it("should handle empty command", () => {
      const { container } = render(<Command />);

      expect(container.querySelector('[cmdk-root]')).toBeInTheDocument();
    });

    it("should merge custom classes with base classes", () => {
      const { container } = render(
        <Command className="bg-red-500">
          <div>Test</div>
        </Command>
      );

      const root = container.querySelector('[cmdk-root]');
      expect(root?.className).toContain("bg-red-500");
      expect(root?.className).toContain("flex");
    });
  });

  describe("CommandDialog", () => {
    it("should render dialog with command", () => {
      render(
        <CommandDialog open>
          <div data-testid="dialog-inner">Content</div>
        </CommandDialog>
      );

      expect(screen.getByTestId("dialog")).toBeInTheDocument();
      expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
    });

    it("should pass dialog props correctly", () => {
      const onOpenChange = vi.fn();
      render(
        <CommandDialog open onOpenChange={onOpenChange}>
          <div>Content</div>
        </CommandDialog>
      );

      expect(onOpenChange).not.toHaveBeenCalled();
      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });

    it("should render command inside dialog", () => {
      const { container } = render(
        <CommandDialog open>
          <div>Dialog content</div>
        </CommandDialog>
      );

      expect(container.querySelector('[cmdk-root]')).toBeInTheDocument();
    });

    it("should handle closed state", () => {
      render(
        <CommandDialog open={false}>
          <div>Content</div>
        </CommandDialog>
      );

      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });
  });

  describe("CommandShortcut", () => {
    it("should render shortcut text", () => {
      render(<CommandShortcut>⌘K</CommandShortcut>);

      expect(screen.getByText("⌘K")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(<CommandShortcut className="custom-shortcut">Ctrl+K</CommandShortcut>);

      const shortcut = screen.getByText("Ctrl+K");
      expect(shortcut.className).toContain("custom-shortcut");
    });

    it("should have correct styling", () => {
      render(<CommandShortcut>⌘K</CommandShortcut>);

      const shortcut = screen.getByText("⌘K");
      expect(shortcut.className).toContain("ml-auto");
      expect(shortcut.className).toContain("text-xs");
    });

    it("should render multiple shortcuts", () => {
      render(
        <div>
          <CommandShortcut>⌘S</CommandShortcut>
          <CommandShortcut>Ctrl+S</CommandShortcut>
        </div>
      );

      expect(screen.getByText("⌘S")).toBeInTheDocument();
      expect(screen.getByText("Ctrl+S")).toBeInTheDocument();
    });

    it("should handle empty shortcut", () => {
      const { container } = render(<CommandShortcut />);

      expect(container.querySelector('span')).toBeInTheDocument();
    });
  });

  describe("Component structure", () => {
    it("should have proper wrapper div classes", () => {
      const { container } = render(
        <Command>
          <div>Content</div>
        </Command>
      );

      const root = container.querySelector('[cmdk-root]');
      expect(root).toBeInTheDocument();
      expect(root?.className).toContain("rounded-md");
      expect(root?.className).toContain("bg-popover");
    });

    it("should handle nested structure", () => {
      const { container } = render(
        <Command>
          <div>
            <div>Nested</div>
          </div>
        </Command>
      );

      expect(screen.getByText("Nested")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle command with no children", () => {
      const { container } = render(<Command />);

      expect(container.querySelector('[cmdk-root]')).toBeInTheDocument();
    });

    it("should handle dialog with complex content", () => {
      render(
        <CommandDialog open>
          <div>
            <span>Complex</span>
            <span>Content</span>
          </div>
        </CommandDialog>
      );

      expect(screen.getByText("Complex")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should render with forwarded ref", () => {
      const ref = vi.fn();
      render(
        <Command ref={ref}>
          <div>Content</div>
        </Command>
      );

      expect(ref).toHaveBeenCalled();
    });
  });

  describe("Styling", () => {
    it("should apply overflow classes", () => {
      const { container } = render(
        <Command>
          <div>Test</div>
        </Command>
      );

      const root = container.querySelector('[cmdk-root]');
      expect(root?.className).toContain("overflow-hidden");
    });

    it("should support text color classes", () => {
      const { container } = render(
        <Command>
          <div>Test</div>
        </Command>
      );

      const root = container.querySelector('[cmdk-root]');
      expect(root?.className).toContain("text-popover-foreground");
    });
  });

  describe("Accessibility and integration", () => {
    it("should maintain component hierarchy", () => {
      const { container } = render(
        <Command>
          <div data-testid="level-1">
            <div data-testid="level-2">Nested</div>
          </div>
        </Command>
      );

      expect(screen.getByTestId("level-1")).toBeInTheDocument();
      expect(screen.getByTestId("level-2")).toBeInTheDocument();
    });

    it("should handle shortcut in complex layout", () => {
      render(
        <div>
          <span>Action</span>
          <CommandShortcut>⌘P</CommandShortcut>
        </div>
      );

      expect(screen.getByText("Action")).toBeInTheDocument();
      expect(screen.getByText("⌘P")).toBeInTheDocument();
    });
  });
});