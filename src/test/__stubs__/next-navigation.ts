// Stub for next/navigation - overridden by vi.mock() in tests
export const notFound = () => { throw new Error('NEXT_NOT_FOUND'); };
export const useRouter = () => ({ push: () => {}, replace: () => {}, back: () => {} });
export const usePathname = () => '/';
export const useSearchParams = () => new URLSearchParams();
