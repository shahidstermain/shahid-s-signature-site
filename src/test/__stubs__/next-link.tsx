// Stub for next/link - overridden by vi.mock() in tests
import React from 'react';

interface LinkProps {
  children: React.ReactNode;
  href: string;
  [key: string]: unknown;
}

export default function Link({ children, href, ...props }: LinkProps) {
  return <a href={href} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>;
}
