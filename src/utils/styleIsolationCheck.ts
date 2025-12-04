/**
 * Style Isolation Check Utility
 * 
 * This utility helps identify potential global CSS dependencies
 * that could cause styling conflicts.
 * 
 * Usage: Run this check before committing new components
 */

export const checkForGlobalCSSDependencies = (code: string): string[] => {
  const warnings: string[] = [];
  
  // Check for CSS variables
  const cssVarPattern = /hsl\(var\(--[^)]+\)\)|var\(--[^)]+\)/g;
  if (cssVarPattern.test(code)) {
    warnings.push('⚠️ Found CSS variables (var(--*)). Use hardcoded hex colors instead.');
  }
  
  // Check for Tailwind utility classes
  const tailwindPattern = /className=["'][^"']*\b(container|mx-auto|text-primary|bg-background|text-foreground|border-border|bg-card|bg-accent|bg-muted|text-muted-foreground)\b/g;
  if (tailwindPattern.test(code)) {
    warnings.push('⚠️ Found Tailwind utility classes. Use isolated component styles instead.');
  }
  
  // Check for global Button/Input imports without custom styling
  const globalComponentPattern = /from ["']@\/components\/ui\/(button|input|card)["']/g;
  if (globalComponentPattern.test(code)) {
    warnings.push('⚠️ Using global UI components. Ensure they don\'t conflict or create custom versions.');
  }
  
  // Check for className without component prefix
  const classNamePattern = /className=["']([^"']*[^-]|[^-][^"']*)/g;
  const matches = code.match(classNamePattern);
  if (matches) {
    const hasPrefix = matches.some(match => {
      const classes = match.replace(/className=["']|["']/g, '').split(' ');
      return classes.some(cls => /^[a-z]{2}-/.test(cls));
    });
    if (!hasPrefix) {
      warnings.push('⚠️ Consider using component-specific class prefixes to avoid conflicts.');
    }
  }
  
  return warnings;
};

/**
 * Validate component isolation
 */
export const validateComponentIsolation = (componentCode: string, componentName: string): {
  isValid: boolean;
  warnings: string[];
  suggestions: string[];
} => {
  const warnings = checkForGlobalCSSDependencies(componentCode);
  const suggestions: string[] = [];
  
  // Check for style tag
  if (!componentCode.includes('<style>') && !componentCode.includes('const.*styles')) {
    suggestions.push('💡 Consider adding isolated styles using <style> tag or CSS-in-JS');
  }
  
  // Check for component prefix
  const prefix = componentName.toLowerCase().replace(/\s+/g, '').substring(0, 2);
  if (!componentCode.includes(`#${prefix}-`) && !componentCode.includes(`.${prefix}-`)) {
    suggestions.push(`💡 Consider using "${prefix}-" prefix for IDs and classes (e.g., #${prefix}-wrapper)`);
  }
  
  // Check for hardcoded colors
  if (!componentCode.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/)) {
    suggestions.push('💡 Ensure colors are hardcoded (hex values) rather than CSS variables');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    suggestions
  };
};

/**
 * Generate component prefix suggestion
 */
export const suggestComponentPrefix = (componentName: string): string => {
  const name = componentName
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
    .split('-')
    .map(word => word.substring(0, 1))
    .join('')
    .substring(0, 2);
  
  return name || 'cp';
};

