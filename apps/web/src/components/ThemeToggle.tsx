import { useEffect, useMemo, useState } from 'react';

const THEMES = [
  { value: 'tablefelt', label: 'Table Felt' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'forest', label: 'Forest' },
] as const;

type Theme = (typeof THEMES)[number]['value'];
const STORAGE_KEY = 'trash-sim-theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const options = useMemo(() => THEMES, []);

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
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored && THEMES.some(({ value }) => value === stored)) {
    return stored;
  }
  return 'tablefelt';
}

