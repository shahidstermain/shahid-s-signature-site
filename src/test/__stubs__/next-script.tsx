// Stub for next/script - overridden by vi.mock() in tests
import React from 'react';

interface ScriptProps {
  id?: string;
  type?: string;
  dangerouslySetInnerHTML?: { __html: string };
  src?: string;
}

export default function Script({ id, type, dangerouslySetInnerHTML, src }: ScriptProps) {
  return <script id={id} type={type} src={src} dangerouslySetInnerHTML={dangerouslySetInnerHTML} />;
}
