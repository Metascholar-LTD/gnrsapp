# Admin Components

This directory contains reusable components and hooks specifically designed for admin pages.

## ConfirmationModal

A beautiful, modern confirmation dialog with blurred background, smooth animations, and multiple variants.

### Features
- ✅ Blurred background overlay (12px blur)
- ✅ Centered on screen
- ✅ Multiple variants: `danger`, `warning`, `info`, `success`
- ✅ Smooth animations
- ✅ Fully responsive
- ✅ Loading state support
- ✅ Dark mode support

### Basic Usage

```tsx
import { ConfirmationModal } from "@/components/admin";
import { useState } from "react";

const MyAdminPage = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (itemToDelete) {
      // Perform delete operation
      console.log("Deleting:", itemToDelete);
      setItemToDelete(null);
    }
  };

  return (
    <>
      <button onClick={() => {
        setItemToDelete("item-123");
        setDeleteModalOpen(true);
      }}>
        Delete Item
      </button>

      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDelete}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
};
```

### Using the Hook (Recommended)

The `useConfirmationModal` hook simplifies modal management:

```tsx
import { ConfirmationModal, useConfirmationModal } from "@/components/admin";
import { toast } from "sonner";

const MyAdminPage = () => {
  const { modalProps, openModal } = useConfirmationModal({
    onConfirm: async () => {
      // Your delete/action logic here
      await deleteItem(itemId);
      toast.success("Item deleted successfully");
    },
    title: "Delete Item",
    description: "Are you sure you want to delete this item? This action cannot be undone.",
    variant: "danger",
    confirmText: "Delete",
    cancelText: "Cancel",
  });

  return (
    <>
      <button onClick={openModal}>Delete Item</button>
      <ConfirmationModal {...modalProps} />
    </>
  );
};
```

### Variants

- **`danger`** - Red theme, for destructive actions (delete, remove)
- **`warning`** - Amber theme, for warnings
- **`info`** - Blue theme, for informational confirmations
- **`success`** - Green theme, for positive actions

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controls modal visibility |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when modal state changes |
| `onConfirm` | `() => void` | - | Callback when user confirms |
| `onCancel` | `() => void` | `undefined` | Optional callback when user cancels |
| `title` | `string` | - | Modal title |
| `description` | `string` | - | Modal description text |
| `confirmText` | `string` | `"Confirm"` | Confirm button text |
| `cancelText` | `string` | `"Cancel"` | Cancel button text |
| `variant` | `ConfirmationVariant` | `"danger"` | Modal variant |
| `isLoading` | `boolean` | `false` | Shows loading state on confirm button |

## Best Practices

1. **Always use confirmation modals for destructive actions** (delete, remove, archive)
2. **Use the hook** (`useConfirmationModal`) for cleaner code
3. **Provide clear descriptions** - explain what will happen
4. **Use appropriate variants** - `danger` for deletes, `warning` for warnings, etc.
5. **Handle loading states** - The hook automatically handles this for async operations

## When to Use

✅ **Use confirmation modals for:**
- Deleting items
- Removing data
- Irreversible actions
- Important state changes
- Bulk operations

❌ **Don't use for:**
- Simple form submissions
- Non-destructive actions
- Actions that can be easily undone
- Navigation

## Examples in Codebase

- `src/pages/admin/adminInfo/FAQsManager.tsx` - FAQ deletion
- `src/pages/admin/components/CarouselManager.tsx` - Slide deletion

