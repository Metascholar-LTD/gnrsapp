// Map icon names to valid feather-icons names
export const iconMap: Record<string, string> = {
  "file-text": "file-text",
  "graduation-cap": "book-open",
  "log-in": "log-in",
  "user-plus": "user-plus",
  "bar-chart-2": "bar-chart-2",
  "alert-circle": "alert-circle",
  "message-square": "message-square",
  "pie-chart": "pie-chart",
  "help-circle": "help-circle",
  "dollar-sign": "dollar-sign",
  "shopping-cart": "shopping-cart",
  "home": "home",
  "image": "image",
  "info": "info",
  "star": "star",
  "folder": "folder",
  "book-open": "book-open",
  "compass": "compass",
  "message-circle": "message-circle",
  "bell": "bell",
  "tag": "tag",
  "smartphone": "smartphone",
  "globe": "globe",
  "user-check": "user-check",
  "building": "package",
  "school": "book",
  "utensils": "coffee",
  "heart": "heart",
  "credit-card": "credit-card",
  "database": "database",
  "settings": "settings",
  "key": "key",
};

// Get valid icon name or fallback
export const getValidIconName = (iconName: string): string => {
  return iconMap[iconName] || iconName;
};

