/**
 * Tests for toast.service integration in UI
 * Testing UI notifications across the app
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toastService } from "@/services/toast.service";

// Mock sonner
jest.mock("sonner", () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
  toast: {
    success: jest.fn((msg) => msg),
    error: jest.fn((msg) => msg),
    info: jest.fn((msg) => msg),
    warning: jest.fn((msg) => msg),
    loading: jest.fn((msg) => msg),
  },
}));

// Test component that uses toast service
function TestComponent() {
  const handleSuccess = () => toastService.success("Success!");
  const handleError = () => toastService.error("Error!");
  const handleInfo = () => toastService.info("Info");

  return (
    <div>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
      <button onClick={handleInfo}>Info</button>
    </div>
  );
}

describe("Toast Service Integration", () => {
  it("should trigger success notification on button click", async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    const button = screen.getByRole("button", { name: /success/i });
    await user.click(button);

    expect(toastService.success).toHaveBeenCalledWith("Success!");
  });

  it("should trigger error notification on button click", async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    const button = screen.getByRole("button", { name: /error/i });
    await user.click(button);

    expect(toastService.error).toHaveBeenCalledWith("Error!");
  });

  it("should trigger info notification on button click", async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    const button = screen.getByRole("button", { name: /info/i });
    await user.click(button);

    expect(toastService.info).toHaveBeenCalledWith("Info");
  });
});
