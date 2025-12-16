/**
 * ConfirmationModal - A beautiful, modern confirmation dialog for admin pages
 * 
 * Features:
 * - Blurred background overlay (12px blur)
 * - Centered on screen
 * - Multiple variants (danger, warning, info, success)
 * - Smooth animations
 * - Fully responsive
 * - Loading state support
 * - Dark mode support
 * 
 * @example Basic Usage
 * ```tsx
 * const [deleteModalOpen, setDeleteModalOpen] = useState(false);
 * 
 * <ConfirmationModal
 *   open={deleteModalOpen}
 *   onOpenChange={setDeleteModalOpen}
 *   onConfirm={handleDelete}
 *   title="Delete Item"
 *   description="Are you sure you want to delete this item?"
 *   variant="danger"
 * />
 * ```
 * 
 * @example Using the Hook (Recommended)
 * ```tsx
 * import { useConfirmationModal } from "@/components/admin";
 * 
 * const { modalProps, openModal } = useConfirmationModal({
 *   onConfirm: async () => await deleteItem(id),
 *   title: "Delete Item",
 *   description: "Are you sure?",
 *   variant: "danger"
 * });
 * 
 * <ConfirmationModal {...modalProps} />
 * <button onClick={openModal}>Delete</button>
 * ```
 * 
 * @see {@link useConfirmationModal} - Recommended hook for easier usage
 * @see {@link README.md} - Full documentation in components/admin/README.md
 */
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Info, Trash2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConfirmationVariant = "danger" | "warning" | "info" | "success";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  isLoading?: boolean;
}

const variantConfig: Record<ConfirmationVariant, { icon: React.ReactNode; color: string; bgColor: string }> = {
  danger: {
    icon: <Trash2 className="h-5 w-5" />,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/20",
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" />,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
  },
  info: {
    icon: <Info className="h-5 w-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  success: {
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}) => {
  const config = variantConfig[variant];

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  return (
    <>
      {/* Custom overlay with blur */}
      <style>{`
        [data-radix-dialog-overlay][data-state="open"] {
          backdrop-filter: blur(12px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(12px) saturate(180%) !important;
          background: rgba(0, 0, 0, 0.5) !important;
        }
      `}</style>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] p-0 gap-0 overflow-hidden border-0 shadow-2xl rounded-2xl bg-white dark:bg-gray-900 [&>button]:hidden">

        {/* Thin Header with Icon, Vertical Line and Title */}
        <div className={cn("flex items-center gap-2 py-3 pl-6 border-b border-gray-200 dark:border-gray-800", config.bgColor)}>
          <span className={cn("flex-shrink-0 inline-flex items-center", config.color)}>
            {config.icon}
          </span>
          <div className={cn("w-[3px] h-6 rounded-full", 
            variant === "danger" && "bg-red-500",
            variant === "warning" && "bg-amber-500",
            variant === "info" && "bg-blue-500",
            variant === "success" && "bg-green-500"
          )}></div>
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 m-0 p-0 leading-none inline-block">
            {title}
          </DialogTitle>
        </div>

        {/* Content */}
        <DialogHeader className="p-[40px]">
          <DialogDescription className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 gap-3 sm:gap-3 flex-col sm:flex-row-reverse border-t border-gray-200 dark:border-gray-800 bg-gradient-to-b from-gray-50/80 to-gray-50 dark:from-gray-900/80 dark:to-gray-900">
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            variant={variant === "danger" ? "destructive" : "default"}
            className={cn(
              "w-full sm:w-auto min-w-[100px] transition-all duration-300 ease-in-out",
              variant === "danger" && "shadow-md hover:shadow-lg hover:shadow-red-500/30",
              variant === "warning" && "bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg hover:shadow-amber-500/30",
              variant === "info" && "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/30",
              variant === "success" && "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg hover:shadow-green-500/30",
              "font-medium"
            )}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
          <Button
            onClick={handleCancel}
            disabled={isLoading}
            variant="outline"
            className="w-full sm:w-auto min-w-[100px] font-medium border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 ease-in-out hover:shadow-md"
          >
            {cancelText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};
