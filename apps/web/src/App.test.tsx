import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const { defaultConfig, runBatchMock } = vi.hoisted(() => ({
  defaultConfig: { variant: 'test' } as const,
  runBatchMock: vi.fn(),
}));

vi.mock('@trash-sim/game-core', () => ({
  defaultConfig,
  runBatch: runBatchMock,
}));

describe('App', () => {
  beforeEach(() => {
    runBatchMock.mockReset();
  });

  it('runs a simulation and displays the results', async () => {
    runBatchMock.mockReturnValue({
      runs: 25,
      successes: 5,
      probability: 0.5,
      expectedGamesToSuccess: 2,
      averageRoundsToWin: 3.2,
      confidenceInterval95: [0.4, 0.6],
    });

    const user = userEvent.setup();

    render(<App />);

    const input = screen.getByLabelText(/number of runs/i);
    await user.clear(input);
    await user.type(input, '25');
    await user.click(screen.getByRole('button', { name: /run simulation/i }));

    await waitFor(() => {
      expect(runBatchMock).toHaveBeenCalledWith({ runs: 25, config: defaultConfig });
    });

    expect(await screen.findByText('50.0000%')).toBeVisible();
    expect(screen.getByText('3.20')).toBeVisible();
    expect(screen.getByText('Perfect first-round wins')).toBeVisible();
    expect(screen.getByRole('button', { name: /run simulation/i })).toBeEnabled();
  });

  it('surfaces errors when simulations fail', async () => {
    runBatchMock.mockImplementation(() => {
      throw new Error('Could not deal cards');
    });

    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: /run simulation/i }));

    expect(
      await screen.findByText('Could not deal cards'),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: /run simulation/i })).toBeEnabled();
  });
});
