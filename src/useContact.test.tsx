import { renderHook } from "@testing-library/react-hooks";
import { useContact } from "./useContact"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, expect } from "vitest";

vi.mock("axios", () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        contacts: [
          {
            first_name: "Đỗ",
            last_name: "Nhật Nam",
            phoneNumber: "0915034222",
          },
        ],
      },
    }),
  },
}));
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, 
      },
    },
  });

describe("useContact", () => {
  it("fetches and handles contacts", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: any) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result, waitForNextUpdate } = renderHook(() => useContact(), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
  });
});
