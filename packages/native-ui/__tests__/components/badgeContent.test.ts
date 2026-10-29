import { resolveBadgeContent } from '../../src/components/badge/badgeContent';

const overflow = (max: number) => `${max}+`;

describe('resolveBadgeContent', () => {
  describe('GIVEN neither a count nor a label', () => {
    describe('WHEN the content is resolved', () => {
      it('THEN a dot is shown', () => {
        const content = resolveBadgeContent({ max: 99, hideZero: true }, overflow);

        expect(content).toEqual({ kind: 'dot' });
      });
    });
  });

  describe('GIVEN a zero count with hideZero', () => {
    describe('WHEN the content is resolved', () => {
      it('THEN the badge is hidden', () => {
        const content = resolveBadgeContent({ count: 0, max: 99, hideZero: true }, overflow);

        expect(content).toEqual({ kind: 'hidden' });
      });
    });
  });

  describe('GIVEN a zero count without hideZero', () => {
    describe('WHEN the content is resolved', () => {
      it('THEN zero is shown', () => {
        const content = resolveBadgeContent({ count: 0, max: 99, hideZero: false }, overflow);

        expect(content).toEqual({ kind: 'text', text: '0' });
      });
    });
  });

  describe('GIVEN a count above the maximum', () => {
    describe('WHEN the content is resolved', () => {
      it('THEN the overflow label is shown', () => {
        const content = resolveBadgeContent({ count: 150, max: 99, hideZero: true }, overflow);

        expect(content).toEqual({ kind: 'text', text: '99+' });
      });
    });
  });

  describe('GIVEN a label together with a zero count', () => {
    describe('WHEN the content is resolved', () => {
      it('THEN the label is shown', () => {
        const content = resolveBadgeContent(
          { label: 'new', count: 0, max: 99, hideZero: true },
          overflow,
        );

        expect(content).toEqual({ kind: 'text', text: 'new' });
      });
    });
  });
});
