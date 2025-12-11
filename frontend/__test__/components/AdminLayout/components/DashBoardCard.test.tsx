import React from 'react';
import { render, screen } from '@test-utils';
import DashboardCard, { DashboardCardProps } from '@/components/AdminLayout/components/Dashboard/DashBordCard';
import { FaBeer } from 'react-icons/fa';

describe('DashboardCard', (): void => {
  it('renders title and value correctly', (): void => {
    render(<DashboardCard title="Test Title" value={42} /> as React.ReactElement);

    const titleElement: HTMLElement = screen.getByText('Test Title');
    const valueElement: HTMLElement = screen.getByText('42');

    expect(titleElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
  });

  it('renders icon if provided', (): void => {
    render(
      <DashboardCard title="Icon Test" value={100} icon={<FaBeer data-testid="icon" />} /> as React.ReactElement
    );

    const iconElement: HTMLElement = screen.getByTestId('icon');
    expect(iconElement).toBeInTheDocument();
  });

  it('uses default color if no color is provided', (): void => {
    render(<DashboardCard title="Color Test" value={1} /> as React.ReactElement);

    const valueElement: HTMLElement = screen.getByText('1');
    const rootDiv: HTMLElement | null = valueElement.closest('div')?.parentElement?.firstChild as HTMLElement;

    expect(rootDiv).toHaveClass('bg-gradient-to-tr from-blue-500 to-blue-400');
  });

  it('applies custom color if provided', (): void => {
    render(<DashboardCard title="Custom Color" value={10} color="from-red-500 to-red-400" /> as React.ReactElement);

    const valueElement: HTMLElement = screen.getByText('10');
    const rootDiv: HTMLElement | null = valueElement.closest('div')?.parentElement?.firstChild as HTMLElement;

    expect(rootDiv).toHaveClass('bg-gradient-to-tr from-red-500 to-red-400');
  });

  it('contains main container classes', (): void => {
    const { container }: { container: HTMLElement } = render(
      <DashboardCard title="Class Test" value={5} /> as React.ReactElement
    );

    const rootDiv: HTMLElement | null = container.firstChild as HTMLElement;
    expect(rootDiv).toHaveClass(
      'flex flex-col items-start gap-3 rounded-2xl p-6 shadow-md'
    );
  });
});
