import { useState, useCallback } from "react";

interface UseConfirmationModalOptions {
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
}

/**
 * Custom hook for managing confirmation modals in admin pages
 * 
 * This hook simplifies the process of adding confirmation modals to admin pages.
 * It handles the modal state and provides easy-to-use functions.
 * 
 * @example
 * ```tsx
 * const { modalProps, openModal } = useConfirmationModal({
 *   onConfirm: async () => {
 *     await deleteItem(itemId);
 *     toast.success('Item deleted');
 *   },
 *   title: "Delete Item",
 *   description: "Are you sure you want to delete this item?",
 *   variant: "danger"
 * });
 * 
 * // In your JSX:
 * <ConfirmationModal {...modalProps} />
 * 
 * // To trigger the modal:
 * <button onClick={() => openModal()}>Delete</button>
 * ```
 */
export const useConfirmationModal = (options: UseConfirmationModalOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (!isLoading) {
      setIsOpen(false);
    }
  }, [isLoading]);

  const handleConfirm = useCallback(async () => {
    setIsLoading(true);
    try {
      await options.onConfirm();
      setIsOpen(false);
    } catch (error) {
      console.error("Confirmation action failed:", error);
      // Don't close modal on error - let the user retry or cancel
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  return {
    modalProps: {
      open: isOpen,
      onOpenChange: setIsOpen,
      onConfirm: handleConfirm,
      title: options.title || "Confirm Action",
      description: options.description || "Are you sure you want to proceed?",
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      variant: options.variant || "danger",
      isLoading,
    },
    openModal,
    closeModal,
    isOpen,
    isLoading,
  };
};

