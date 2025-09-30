import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import ThemeToggle from './ThemeToggle';

const STORAGE_KEY = 'trash-sim-theme';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('initialises from the stored preference', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');

    render(<ThemeToggle />);

    expect(screen.getByRole('combobox')).toHaveValue('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('persists a newly selected theme', async () => {
    const user = userEvent.setup();

    render(<ThemeToggle />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'forest');

    expect(select).toHaveValue('forest');
    expect(document.documentElement.getAttribute('data-theme')).toBe('forest');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('forest');
  });
});
