import { useEffect, useState } from 'react';

const THEMES = ['light', 'dark', 'forest'] as const;
type Theme = (typeof THEMES)[number];
const STORAGE_KEY = 'trash-sim-theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">Theme</span>
      </div>
      <select
        className="select select-bordered"
        value={theme}
        onChange={(event) => setTheme(event.target.value as Theme)}
      >
        {THEMES.map((value) => (
          <option key={value} value={value}>
            {capitalize(value)}
          </option>
        ))}
      </select>
    </label>
  );
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored && THEMES.includes(stored)) {
    return stored;
  }
  return 'light';
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}