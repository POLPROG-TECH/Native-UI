import {
  defaultSemanticTokens,
  defaultSemanticColors,
  defaultSemanticSpacing,
  defaultSemanticTypography,
} from '../../src/tokens/semantic';
import { typography } from '../../src/tokens/typography';
import { spacing } from '../../src/tokens/spacing';

describe('defaultSemanticColors', () => {
  describe('GIVEN the defaultSemanticColors mapping', () => {
    describe('WHEN the action-related entries are read', () => {
      it('THEN each action token maps to its expected ColorScheme key', () => {
        const { actionPrimary, actionSecondary, actionDanger, actionDisabled } =
          defaultSemanticColors;

        expect(actionPrimary).toBe('primary');
        expect(actionSecondary).toBe('primaryLight');
        expect(actionDanger).toBe('error');
        expect(actionDisabled).toBe('textTertiary');
      });
    });

    describe('WHEN the feedback-related entries are read', () => {
      it('THEN each feedback token maps to its expected ColorScheme key', () => {
        const { feedbackSuccess, feedbackWarning, feedbackError, feedbackInfo } =
          defaultSemanticColors;

        expect(feedbackSuccess).toBe('success');
        expect(feedbackWarning).toBe('warning');
        expect(feedbackError).toBe('error');
        expect(feedbackInfo).toBe('info');
      });
    });

    describe('WHEN the surface-related entries are read', () => {
      it('THEN each surface token maps to its expected ColorScheme key', () => {
        const { surfaceApp, surfaceCard, surfaceModal, surfaceInput } = defaultSemanticColors;

        expect(surfaceApp).toBe('background');
        expect(surfaceCard).toBe('surface');
        expect(surfaceModal).toBe('surface');
        expect(surfaceInput).toBe('surfaceSecondary');
      });
    });

    describe('WHEN the text-related entries are read', () => {
      it('THEN each text token maps to its expected ColorScheme key', () => {
        const { textHeading, textBody, textMuted, textInverse, textLink } = defaultSemanticColors;

        expect(textHeading).toBe('textPrimary');
        expect(textBody).toBe('textPrimary');
        expect(textMuted).toBe('textSecondary');
        expect(textInverse).toBe('textInverse');
        expect(textLink).toBe('primaryText');
      });
    });
  });
});

describe('defaultSemanticSpacing', () => {
  describe('GIVEN the set of valid spacing token keys', () => {
    describe('WHEN all semantic spacing values are collected', () => {
      it('THEN every semantic spacing value exists among the valid spacing keys', () => {
        const validKeys = Object.keys(spacing);

        const semanticValues = Object.values(defaultSemanticSpacing);

        semanticValues.forEach((val) => {
          expect(validKeys).toContain(val);
        });
      });
    });
  });

  describe('GIVEN the defaultSemanticSpacing mapping', () => {
    describe('WHEN its core entries are read', () => {
      it('THEN the defaults match the documented values', () => {
        const { pageHorizontal, cardPadding, stackGap } = defaultSemanticSpacing;

        expect(pageHorizontal).toBe('lg');
        expect(cardPadding).toBe('lg');
        expect(stackGap).toBe('md');
      });
    });
  });
});

describe('defaultSemanticTypography', () => {
  describe('GIVEN the set of valid typography variant keys', () => {
    describe('WHEN all semantic typography values are collected', () => {
      it('THEN every semantic typography value exists among the valid variant keys', () => {
        const validKeys = Object.keys(typography);

        const semanticValues = Object.values(defaultSemanticTypography);

        semanticValues.forEach((val) => {
          expect(validKeys).toContain(val);
        });
      });
    });
  });

  describe('GIVEN the defaultSemanticTypography mapping', () => {
    describe('WHEN its core entries are read', () => {
      it('THEN the defaults match the documented variant ids', () => {
        const { pageTitle, sectionTitle, bodyDefault, captionDefault } = defaultSemanticTypography;

        expect(pageTitle).toBe('h1');
        expect(sectionTitle).toBe('h2');
        expect(bodyDefault).toBe('body');
        expect(captionDefault).toBe('caption');
      });
    });
  });
});

describe('defaultSemanticTokens (combined)', () => {
  describe('GIVEN the combined defaultSemanticTokens object', () => {
    describe('WHEN its grouped entries are read', () => {
      it('THEN each group references the corresponding default object', () => {
        const { colors, spacing: sp, typography: ty } = defaultSemanticTokens;

        expect(colors).toBe(defaultSemanticColors);
        expect(sp).toBe(defaultSemanticSpacing);
        expect(ty).toBe(defaultSemanticTypography);
      });
    });
  });
});
