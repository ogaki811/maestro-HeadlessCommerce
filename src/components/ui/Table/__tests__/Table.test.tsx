/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import Table from '../Table';
import TableHeader from '../TableHeader';
import TableBody from '../TableBody';
import TableRow from '../TableRow';
import TableHeaderCell from '../TableHeaderCell';
import TableCell from '../TableCell';

describe('Table', () => {
  it('renders table element with children', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Header 1</TableHeaderCell>
            <TableHeaderCell>Header 2</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell 1</TableCell>
            <TableCell>Cell 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Table className="custom-table">
        <TableBody>
          <TableRow>
            <TableCell>Test</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const table = container.querySelector('table');
    expect(table).toHaveClass('custom-table');
  });

  it('renders with default Tailwind styles', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Test</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const table = container.querySelector('table');
    expect(table).toHaveClass('min-w-full');
    expect(table).toHaveClass('border-collapse');
  });
});

describe('TableHeader', () => {
  it('renders thead element', () => {
    const { container } = render(
      <table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Header</TableHeaderCell>
          </TableRow>
        </TableHeader>
      </table>
    );

    expect(container.querySelector('thead')).toBeInTheDocument();
  });

  it('applies background color styling', () => {
    const { container } = render(
      <table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Header</TableHeaderCell>
          </TableRow>
        </TableHeader>
      </table>
    );

    const thead = container.querySelector('thead');
    expect(thead).toHaveClass('bg-gray-50');
  });
});

describe('TableBody', () => {
  it('renders tbody element', () => {
    const { container } = render(
      <table>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </table>
    );

    expect(container.querySelector('tbody')).toBeInTheDocument();
  });

  it('applies divide styling', () => {
    const { container } = render(
      <table>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </table>
    );

    const tbody = container.querySelector('tbody');
    expect(tbody).toHaveClass('divide-y');
    expect(tbody).toHaveClass('divide-gray-200');
  });
});

describe('TableRow', () => {
  it('renders tr element', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </tbody>
      </table>
    );

    expect(container.querySelector('tr')).toBeInTheDocument();
  });

  it('applies hover effect', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </tbody>
      </table>
    );

    const tr = container.querySelector('tr');
    expect(tr).toHaveClass('hover:bg-gray-50');
  });

  it('applies custom className', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow className="custom-row">
            <TableCell>Cell</TableCell>
          </TableRow>
        </tbody>
      </table>
    );

    const tr = container.querySelector('tr');
    expect(tr).toHaveClass('custom-row');
  });
});

describe('TableHeaderCell', () => {
  it('renders th element with correct text', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHeaderCell>Column Header</TableHeaderCell>
          </tr>
        </thead>
      </table>
    );

    expect(screen.getByText('Column Header')).toBeInTheDocument();
    expect(screen.getByText('Column Header').tagName).toBe('TH');
  });

  it('applies text alignment and padding', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHeaderCell>Header</TableHeaderCell>
          </tr>
        </thead>
      </table>
    );

    const th = container.querySelector('th');
    expect(th).toHaveClass('px-4');
    expect(th).toHaveClass('py-3');
    expect(th).toHaveClass('text-left');
  });

  it('supports text alignment prop', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHeaderCell align="center">Header</TableHeaderCell>
          </tr>
        </thead>
      </table>
    );

    const th = container.querySelector('th');
    expect(th).toHaveClass('text-center');
  });

  it('applies custom className', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHeaderCell className="custom-header">Header</TableHeaderCell>
          </tr>
        </thead>
      </table>
    );

    const th = container.querySelector('th');
    expect(th).toHaveClass('custom-header');
  });
});

describe('TableCell', () => {
  it('renders td element with correct text', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Cell Content</TableCell>
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('Cell Content')).toBeInTheDocument();
    expect(screen.getByText('Cell Content').tagName).toBe('TD');
  });

  it('applies padding', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell>Content</TableCell>
          </tr>
        </tbody>
      </table>
    );

    const td = container.querySelector('td');
    expect(td).toHaveClass('px-4');
    expect(td).toHaveClass('py-3');
  });

  it('supports text alignment prop', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell align="right">Content</TableCell>
          </tr>
        </tbody>
      </table>
    );

    const td = container.querySelector('td');
    expect(td).toHaveClass('text-right');
  });

  it('applies custom className', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell className="custom-cell">Content</TableCell>
          </tr>
        </tbody>
      </table>
    );

    const td = container.querySelector('td');
    expect(td).toHaveClass('custom-cell');
  });

  it('renders children components', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>
              <button>Action</button>
            </TableCell>
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});
