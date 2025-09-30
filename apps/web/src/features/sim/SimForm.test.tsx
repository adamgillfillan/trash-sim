import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import SimForm from './SimForm';

describe('SimForm', () => {
  it('submits parsed runs when the form is valid', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    render(<SimForm defaultRuns={100_000} loading={false} onSubmit={handleSubmit} />);

    const input = screen.getByLabelText(/number of runs/i);
    await user.clear(input);
    await user.type(input, '25000');
    await user.click(screen.getByRole('button', { name: /run simulation/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(25_000);
    });
  });

  it('shows an error when runs is not a positive integer', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<SimForm defaultRuns={10} loading={false} onSubmit={handleSubmit} />);

    const input = screen.getByLabelText(/number of runs/i);
    fireEvent.change(input, { target: { value: '0' } });
    await user.click(screen.getByRole('button', { name: /run simulation/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Please enter a positive number of runs.');
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('enforces the maximum number of runs', async () => {
    const user = userEvent.setup();

    render(<SimForm defaultRuns={10} loading={false} onSubmit={vi.fn()} />);

    const input = screen.getByLabelText(/number of runs/i);
    fireEvent.change(input, { target: { value: '1000001' } });
    await user.click(screen.getByRole('button', { name: /run simulation/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Please choose 1,000,000 runs or fewer.');
    });
  });

  it('disables inputs while loading', () => {
    render(<SimForm defaultRuns={10} loading={true} onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/number of runs/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /running/i })).toBeDisabled();
  });
});
