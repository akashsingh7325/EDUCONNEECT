export function resolveTheme(theme = "Dark") {
  if (theme === "System") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "Dark" : "Light";
  }
  return theme === "Light" ? "Light" : "Dark";
}

export function applyTheme(theme = "Dark") {
  const resolved = resolveTheme(theme);
  document.documentElement.dataset.theme = resolved.toLowerCase();
  document.documentElement.style.colorScheme = resolved.toLowerCase();
  return resolved;
}

export function loadSavedTheme() {
  try {
    const stored = JSON.parse(localStorage.getItem("educonnectSettings"));
    return stored?.theme || "Dark";
  } catch {
    return "Dark";
  }
}

applyTheme(loadSavedTheme());
