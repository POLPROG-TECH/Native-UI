---
'@polprog/native-ui': minor
---

Add the Bloom theme variant and a `theme` config key.

`NativeUIProvider` now accepts `theme: 'default' | 'bloom' | ThemeVariant`. A theme variant bundles a complete visual identity (colour palette, corner radii, elevation, type density, and default fonts) behind one name and restyles every component. The new **Bloom** variant is a soft, rounded look: violet/pink accents, rounded corners, purple-tinted neutrals, and Outfit + Plus Jakarta Sans typography. The original look ships unchanged as the **Aurora** (`'default'`) variant, so existing apps are unaffected.

`FontFamilies` gains an optional `display` group so a variant can pair a heading family with a separate body family. New exports: `THEME_VARIANTS`, `defaultThemeVariant`, `bloomThemeVariant`, `resolveThemeVariant`, `defaultColorPalette`, `bloomColorPalette`, `BLOOM_PRESETS`, `bloomFontFamilies`, and the types `ThemeVariant`, `ThemeVariantName`, `ColorPalette`, `TextRamp`, `SemanticRamp`, `NeutralRamp`, `BloomPreset`, `BorderRadiusScale`.
