# Styling Guidelines - Global CSS Dependency Policy

## ⚠️ IMPORTANT: Avoid Global CSS Dependencies

**Date Established:** Current Session  
**Reason:** Global CSS is causing conflicts with component styling and breaking UI elements.

## Policy

### ✅ DO: Use Isolated Component Styles

1. **Create self-contained styles for each component/page**
   - Use unique class names with component-specific prefixes (e.g., `sw-` for SkilledWorkers)
   - Use unique IDs with component-specific prefixes
   - Define all styles within the component using `<style>` tags or CSS-in-JS

2. **Use hardcoded color values**
   - Use explicit hex colors (`#2563eb`, `#ffffff`) instead of CSS variables
   - Avoid `hsl(var(--variable))` patterns
   - Avoid Tailwind utility classes that depend on global config

3. **Create custom components instead of relying on global UI components**
   - Build custom buttons, inputs, etc. when global components cause conflicts
   - Use inline styles for simple cases
   - Define component-specific CSS classes

4. **Isolate responsive styles**
   - Include all media queries within component styles
   - Don't rely on global breakpoint utilities

### ❌ DON'T: Depend on Global CSS

1. **Avoid CSS variables from global theme**
   - Don't use `hsl(var(--background))`
   - Don't use `hsl(var(--foreground))`
   - Don't use `hsl(var(--primary))`
   - Don't use any `var(--*)` patterns

2. **Avoid global utility classes**
   - Don't use Tailwind classes like `container`, `mx-auto`, `text-primary`
   - Don't use Bootstrap classes
   - Don't use any global utility classes

3. **Avoid global UI component libraries**
   - If shadcn/ui or other global components cause conflicts, create custom versions
   - Don't use global Button, Input, Card components if they break styling

4. **Avoid global CSS imports**
   - Don't import global stylesheets unless absolutely necessary
   - If imported, ensure component styles override them with higher specificity

## Example: Properly Isolated Component

```tsx
// ✅ GOOD - Isolated component
const MyComponent = () => {
  const isolatedStyles = `
    #my-component-wrapper {
      width: 100%;
      background-color: #ffffff;
      padding: 2rem;
    }
    
    .my-component-button {
      background-color: #2563eb;
      color: #ffffff;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
    }
    
    .my-component-button:hover {
      background-color: #1d4ed8;
    }
  `;

  return (
    <div id="my-component-wrapper">
      <style>{isolatedStyles}</style>
      <button className="my-component-button">
        Click Me
      </button>
    </div>
  );
};
```

```tsx
// ❌ BAD - Depends on global CSS
const MyComponent = () => {
  return (
    <div className="container mx-auto bg-background">
      <Button variant="primary" className="text-primary">
        Click Me
      </Button>
    </div>
  );
};
```

## When Global CSS is Acceptable

Global CSS should ONLY be used when:
1. **Absolutely necessary** for shared layout components (Navigation, Footer)
2. **No conflicts** can be verified
3. **Explicitly documented** why global CSS is needed
4. **Component styles override** global styles with higher specificity

## Naming Conventions

### Component Prefixes
- SkilledWorkers: `sw-`
- JobListings: `jl-`
- UserProfile: `up-`
- etc.

### Pattern
- IDs: `#component-prefix-element-name` (e.g., `#sw-hero-section`)
- Classes: `.component-prefix-element-name` (e.g., `.sw-category-btn`)

## Checklist for New Components

Before creating a new component, ensure:
- [ ] All styles are defined within the component
- [ ] Unique prefix is used for all IDs and classes
- [ ] No CSS variables are used (use hex colors)
- [ ] No global utility classes are used
- [ ] Custom components are created if global ones conflict
- [ ] All text colors are explicitly set
- [ ] Responsive styles are included within component styles

## Reference Files

- `src/pages/SkilledWorkers.tsx` - Example of properly isolated component
- This file should be referenced when creating new components

## Notes

- If you encounter styling conflicts, check if global CSS is being used
- When in doubt, isolate the styles completely
- Test components in isolation to ensure no global CSS dependencies
- Document any exceptions to this policy

---

**Remember:** Better to have slightly more verbose but isolated styles than to deal with global CSS conflicts that break components.

