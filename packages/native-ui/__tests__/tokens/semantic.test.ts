import {
  defaultSemanticTokens,
  defaultSemanticColors,
  defaultSemanticSpacing,
  defaultSemanticTypography,
} from '../../src/tokens/semantic';
import { typography } from '../../src/tokens/typography';
import { spacing } from '../../src/tokens/spacing';

describe('defaultSemanticColors', () => {
  it('should_map_action_tokens_to_expected_ColorScheme_keys', () => {
    // GIVEN the defaultSemanticColors mapping

    // WHEN the action-related entries are read
    const { actionPrimary, actionSecondary, actionDanger, actionDisabled } = defaultSemanticColors;

    // THEN each action token maps to its expected ColorScheme key
    expect(actionPrimary).toBe('primary');
    expect(actionSecondary).toBe('primaryLight');
    expect(actionDanger).toBe('error');
    expect(actionDisabled).toBe('textTertiary');
  });

  it('should_map_feedback_tokens_to_expected_ColorScheme_keys', () => {
    // GIVEN the defaultSemanticColors mapping

    // WHEN the feedback-related entries are read
    const { feedbackSuccess, feedbackWarning, feedbackError, feedbackInfo } = defaultSemanticColors;

    // THEN each feedback token maps to its expected ColorScheme key
    expect(feedbackSuccess).toBe('success');
    expect(feedbackWarning).toBe('warning');
    expect(feedbackError).toBe('error');
    expect(feedbackInfo).toBe('info');
  });

  it('should_map_surface_tokens_to_expected_ColorScheme_keys', () => {
    // GIVEN the defaultSemanticColors mapping

    // WHEN the surface-related entries are read
    const { surfaceApp, surfaceCard, surfaceModal, surfaceInput } = defaultSemanticColors;

    // THEN each surface token maps to its expected ColorScheme key
    expect(surfaceApp).toBe('background');
    expect(surfaceCard).toBe('surface');
    expect(surfaceModal).toBe('surface');
    expect(surfaceInput).toBe('surfaceSecondary');
  });

  it('should_map_text_tokens_to_expected_ColorScheme_keys', () => {
    // GIVEN the defaultSemanticColors mapping

    // WHEN the text-related entries are read
    const { textHeading, textBody, textMuted, textInverse, textLink } = defaultSemanticColors;

    // THEN each text token maps to its expected ColorScheme key
    expect(textHeading).toBe('textPrimary');
    expect(textBody).toBe('textPrimary');
    expect(textMuted).toBe('textSecondary');
    expect(textInverse).toBe('textInverse');
    expect(textLink).toBe('primary');
  });
});

describe('defaultSemanticSpacing', () => {
  it('should_reference_only_valid_spacing_token_keys', () => {
    // GIVEN the set of valid spacing token keys
    const validKeys = Object.keys(spacing);

    // WHEN all semantic spacing values are collected
    const semanticValues = Object.values(defaultSemanticSpacing);

    // THEN every semantic spacing value exists among the valid spacing keys
    semanticValues.forEach((val) => {
      expect(validKeys).toContain(val);
    });
  });

  it('should_expose_expected_defaults_for_pageHorizontal_cardPadding_and_stackGap', () => {
    // GIVEN the defaultSemanticSpacing mapping

    // WHEN its core entries are read
    const { pageHorizontal, cardPadding, stackGap } = defaultSemanticSpacing;

    // THEN the defaults match the documented values
    expect(pageHorizontal).toBe('lg');
    expect(cardPadding).toBe('lg');
    expect(stackGap).toBe('md');
  });
});

describe('defaultSemanticTypography', () => {
  it('should_reference_only_valid_typography_variant_keys', () => {
    // GIVEN the set of valid typography variant keys
    const validKeys = Object.keys(typography);

    // WHEN all semantic typography values are collected
    const semanticValues = Object.values(defaultSemanticTypography);

    // THEN every semantic typography value exists among the valid variant keys
    semanticValues.forEach((val) => {
      expect(validKeys).toContain(val);
    });
  });

  it('should_expose_expected_defaults_for_pageTitle_sectionTitle_bodyDefault_and_captionDefault', () => {
    // GIVEN the defaultSemanticTypography mapping

    // WHEN its core entries are read
    const { pageTitle, sectionTitle, bodyDefault, captionDefault } = defaultSemanticTypography;

    // THEN the defaults match the documented variant ids
    expect(pageTitle).toBe('h1');
    expect(sectionTitle).toBe('h2');
    expect(bodyDefault).toBe('body');
    expect(captionDefault).toBe('caption');
  });
});

describe('defaultSemanticTokens (combined)', () => {
  it('should_combine_colors_spacing_and_typography_groups_by_reference', () => {
    // GIVEN the combined defaultSemanticTokens object

    // WHEN its grouped entries are read
    const { colors, spacing: sp, typography: ty } = defaultSemanticTokens;

    // THEN each group references the corresponding default object
    expect(colors).toBe(defaultSemanticColors);
    expect(sp).toBe(defaultSemanticSpacing);
    expect(ty).toBe(defaultSemanticTypography);
  });
});
