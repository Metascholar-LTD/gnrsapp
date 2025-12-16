# Admin Development Guide

## Quick Reference for Confirmation Modals

When developing admin pages, **always use confirmation modals for destructive actions** (delete, remove, archive, etc.).

### Quick Import

```tsx
import { ConfirmationModal, useConfirmationModal } from "@/components/admin";
```

### Quick Example

```tsx
// Option 1: Using the hook (Recommended - handles loading states automatically)
const { modalProps, openModal } = useConfirmationModal({
  onConfirm: async () => {
    await deleteItem(itemId);
    toast.success('Item deleted');
  },
  title: "Delete Item",
  description: "Are you sure? This cannot be undone.",
  variant: "danger"
});

<button onClick={openModal}>Delete</button>
<ConfirmationModal {...modalProps} />

// Option 2: Manual state management
const [modalOpen, setModalOpen] = useState(false);
<ConfirmationModal
  open={modalOpen}
  onOpenChange={setModalOpen}
  onConfirm={handleDelete}
  title="Delete Item"
  description="Are you sure?"
  variant="danger"
/>
```

### Variants

- `danger` - For delete/remove actions (red)
- `warning` - For warnings (amber)
- `info` - For informational confirmations (blue)
- `success` - For positive actions (green)

### When to Use

✅ **Always use for:**
- Deleting items
- Removing data
- Irreversible actions
- Important state changes

❌ **Don't use for:**
- Simple form submissions
- Non-destructive actions
- Actions that can be easily undone

### Full Documentation

See `src/components/admin/README.md` for complete documentation and examples.

### Examples in Codebase

- `src/pages/admin/adminInfo/FAQsManager.tsx`
- `src/pages/admin/components/CarouselManager.tsx`

