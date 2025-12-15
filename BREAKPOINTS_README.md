# Breakpoints Configuration

This document explains how to use the centralized breakpoints configuration in the project.

## Files

- **`src/lib/breakpoints.ts`** - TypeScript constants and helper functions
- **`src/lib/breakpoints.css`** - CSS custom properties (CSS variables)

## Usage

### Option 1: Using TypeScript Constants (Recommended)

Import the constants in your component:

```tsx
import { BREAKPOINTS, DIRECTORY_PADDING, MEDIA_QUERIES } from '@/lib/breakpoints';

const isolatedStyles = `
  /* Mobile: 0px - 767px */
  @media ${MEDIA_QUERIES.MOBILE} {
    .my-content-wrapper {
      padding-top: ${DIRECTORY_PADDING.MOBILE.PADDING_TOP};
    }

    .my-main-content {
      padding: ${DIRECTORY_PADDING.MOBILE.PADDING};
    }
  }

  /* Tablet: 768px - 1199px */
  @media ${MEDIA_QUERIES.TABLET} {
    .my-content-wrapper {
      padding-top: ${DIRECTORY_PADDING.TABLET.PADDING_TOP};
    }

    .my-main-content {
      padding: ${DIRECTORY_PADDING.TABLET.PADDING};
    }
  }

  /* Desktop: 1200px - 1599px */
  @media ${MEDIA_QUERIES.DESKTOP} {
    .my-content-wrapper {
      padding-top: ${DIRECTORY_PADDING.DESKTOP.PADDING_TOP};
    }

    .my-main-content {
      padding: ${DIRECTORY_PADDING.DESKTOP.PADDING};
    }
  }

  /* Large Desktop: 1600px+ */
  @media ${MEDIA_QUERIES.LARGE_DESKTOP} {
    .my-content-wrapper {
      padding-top: ${DIRECTORY_PADDING.LARGE_DESKTOP.PADDING_TOP};
    }

    .my-main-content {
      padding: ${DIRECTORY_PADDING.LARGE_DESKTOP.PADDING};
    }
  }
`;
```

### Option 2: Using the Helper Function

For directory pages, use the helper function:

```tsx
import { generateDirectoryStyles } from '@/lib/breakpoints';

const isolatedStyles = `
  .my-page-wrapper {
    min-height: calc(100vh - 80px);
  }

  .my-page-content {
    max-width: 1400px;
    margin: 0 auto;
  }

  ${generateDirectoryStyles('my-page-wrapper', 'my-page-content')}
`;
```

### Option 3: Using CSS Variables

If you prefer CSS, use the CSS custom properties:

```css
@media (max-width: var(--breakpoint-mobile-max)) {
  .my-content-wrapper {
    padding-top: var(--directory-padding-top-mobile);
  }

  .my-main-content {
    padding: var(--directory-padding-mobile);
  }
}
```

## Breakpoint Values

| Breakpoint | Min Width | Max Width |
|------------|-----------|-----------|
| Mobile | 0px | 767px |
| Tablet | 768px | 1199px |
| Desktop | 1200px | 1599px |
| Large Desktop | 1600px+ | - |

## Padding Values

| Breakpoint | Padding | Padding Top |
|------------|---------|-------------|
| Mobile | 1rem | 60px |
| Tablet | 1.5rem | 70px |
| Desktop | 2rem | 120px |
| Large Desktop | clamp(2rem, 5vw, 4rem) | 120px |

## Example: Complete Directory Page

```tsx
import { generateDirectoryStyles } from '@/lib/breakpoints';

const MyDirectoryPage: React.FC = () => {
  const isolatedStyles = `
    .my-page {
      min-height: 100vh;
      background: #ffffff;
    }

    .my-content-wrapper {
      min-height: calc(100vh - 80px);
    }

    .my-main-content {
      max-width: 1400px;
      margin: 0 auto;
    }

    ${generateDirectoryStyles('my-content-wrapper', 'my-main-content')}
  `;

  return (
    <div className="my-page">
      <style>{isolatedStyles}</style>
      <Navigation />
      <div className="my-content-wrapper">
        <div className="my-main-content">
          {/* Your content here */}
        </div>
      </div>
      <Footer />
    </div>
  );
};
```

## Benefits

1. **Consistency**: All pages use the same breakpoints and padding
2. **Maintainability**: Change breakpoints in one place, update everywhere
3. **Type Safety**: TypeScript ensures correct usage
4. **Documentation**: Clear constants make code self-documenting
5. **Flexibility**: Multiple ways to use (TypeScript, CSS variables, helper functions)

