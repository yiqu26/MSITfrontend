import * as React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { useIsMobile } from './use-mobile';

function TestComponent() {
  const isMobile = useIsMobile();
  return <div data-testid="result">{isMobile ? 'true' : 'false'}</div>;
}

describe('useIsMobile', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: window.innerWidth < 768,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('returns true when width is below 768', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    render(<TestComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('result')).toHaveTextContent('true');
    });
  });

  it('returns false when width is 768 or above', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    render(<TestComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('result')).toHaveTextContent('false');
    });
  });
});
