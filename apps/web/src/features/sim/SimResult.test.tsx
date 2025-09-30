import { render, screen } from '@testing-library/react';
import type { BatchResult } from '@trash-sim/game-core';
import SimResult from './SimResult';

const sampleBatch: BatchResult = {
  runs: 1_000,
  successes: 123,
  probability: 0.456789,
  expectedGamesToSuccess: 2.5,
  averageRoundsToWin: 3.4,
  confidenceInterval95: [0.3, 0.6],
};

describe('SimResult', () => {
  it('shows an intro panel while idle', () => {
    render(<SimResult result={null} loading={false} />);

    expect(screen.getByRole('heading', { name: 'Results' })).toBeVisible();
    expect(
      screen.getByText(/run simulations here to estimate/i),
    ).toBeVisible();
  });

  it('renders a loading state before results arrive', () => {
    render(<SimResult result={null} loading={true} />);

    const message = screen.getByText('Running simulations...');
    const section = message.closest('section');
    expect(section).not.toBeNull();
    expect(section).toHaveAttribute('aria-busy', 'true');
    expect(message).toBeVisible();
  });

  it('formats statistics when results are available', () => {
    render(
      <SimResult
        loading={false}
        result={{
          runs: 200_000,
          runtimeMs: 4_200,
          batch: sampleBatch,
        }}
      />,
    );

    expect(screen.getByText('Runs: 200,000')).toBeVisible();
    expect(screen.getByText('Runtime: 4.20 seconds')).toBeVisible();
    expect(screen.getByText('45.6789%')).toBeVisible();
    expect(screen.getByText('3.40')).toBeVisible();
    expect(screen.getByText('2.50')).toBeVisible();
    expect(screen.getByText('30.0000% - 60.0000%')).toBeVisible();
    expect(screen.getByText('123')).toBeVisible();
    expect(screen.getByText('Average rounds until win')).toBeVisible();
  });

  it('shows the in-progress badge when still calculating', () => {
    render(
      <SimResult
        loading={true}
        result={{
          runs: 1,
          runtimeMs: 100,
          batch: sampleBatch,
        }}
      />,
    );

    expect(
      screen.getByLabelText('Running simulations'),
    ).toBeInTheDocument();
  });
});
