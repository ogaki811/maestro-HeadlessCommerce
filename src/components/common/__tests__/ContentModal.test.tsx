/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import ContentModal from '../ContentModal';

describe('ContentModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders modal when isOpen is true', () => {
    render(
      <ContentModal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <p>Modal content</p>
      </ContentModal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    render(
      <ContentModal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <p>Modal content</p>
      </ContentModal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('renders title correctly', () => {
    render(
      <ContentModal isOpen={true} onClose={mockOnClose} title="Custom Title">
        <p>Content</p>
      </ContentModal>
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <ContentModal isOpen={true} onClose={mockOnClose} title="Title">
        <div data-testid="custom-content">
          <h2>Custom Heading</h2>
          <p>Custom paragraph</p>
        </div>
      </ContentModal>
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('Custom Heading')).toBeInTheDocument();
    expect(screen.getByText('Custom paragraph')).toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', () => {
    render(
      <ContentModal isOpen={true} onClose={mockOnClose} title="Title">
        <p>Content</p>
      </ContentModal>
    );

    const overlay = document.querySelector('.ec-content-modal__overlay');
    expect(overlay).toBeInTheDocument();

    if (overlay) {
      fireEvent.click(overlay);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <ContentModal isOpen={true} onClose={mockOnClose} title="Title">
        <p>Content</p>
      </ContentModal>
    );

    const closeButton = screen.getByRole('button', { name: '閉じる' });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when ESC key is pressed', () => {
    render(
      <ContentModal isOpen={true} onClose={mockOnClose} title="Title">
        <p>Content</p>
      </ContentModal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    render(
      <ContentModal isOpen={true} onClose={mockOnClose} title="Title">
        <p>Content</p>
      </ContentModal>
    );

    const modalContent = document.querySelector('.ec-content-modal__content');
    expect(modalContent).toBeInTheDocument();

    if (modalContent) {
      fireEvent.click(modalContent);
      expect(mockOnClose).not.toHaveBeenCalled();
    }
  });

  it('applies correct styling classes', () => {
    const { container } = render(
      <ContentModal isOpen={true} onClose={mockOnClose} title="Title">
        <p>Content</p>
      </ContentModal>
    );

    const modal = container.querySelector('.ec-content-modal');
    expect(modal).toHaveClass('fixed', 'inset-0', 'z-50');

    const overlay = container.querySelector('.ec-content-modal__overlay');
    expect(overlay).toHaveClass('absolute', 'inset-0', 'bg-black/50');
  });
});
