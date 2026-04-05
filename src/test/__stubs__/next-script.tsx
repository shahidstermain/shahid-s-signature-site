// Stub for next/script - overridden by vi.mock() in tests
import React from 'react';
export default function Script({ id, type, dangerouslySetInnerHTML, src }: { id?: string; type?: string; dangerouslySetInnerHTML?: { __html: string }; src?: string }) {
  return <script id={id} type={type} src={src} dangerouslySetInnerHTML={dangerouslySetInnerHTML} />;
}
