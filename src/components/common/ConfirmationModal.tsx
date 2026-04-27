import {
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "danger" | "primary";
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const confirmButtonClasses =
    confirmVariant === "danger"
      ? "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      : "px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium";

  const confirmButtonStyle =
    confirmVariant !== "danger"
      ? {
          background:
            "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))",
        }
      : {};

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="rounded-xl max-w-md w-full p-6"
        style={{
          backgroundColor: "var(--color-surface-elevated)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {confirmVariant === "danger" && (
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-error) 18%, transparent)",
                }}
              >
                <ExclamationTriangleIcon
                  className="w-6 h-6"
                  style={{ color: "var(--color-error)" }}
                />
              </div>
            )}
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-lg transition-colors disabled:opacity-50"
            style={{ color: "var(--color-text-tertiary)" }}
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <p
          className="mb-6 ml-13"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {message}
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            style={{
              backgroundColor: "var(--color-surface-container-high)",
              color: "var(--color-text-secondary)",
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={confirmButtonClasses}
            style={confirmButtonStyle}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
