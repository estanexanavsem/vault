import stylelintConfigStandard from 'stylelint-config-standard'
import stylelintConfigTailwindcss from '@dreamsicle.io/stylelint-config-tailwindcss'

const rawColorValuePattern = '/(?:#[0-9a-fA-F]{3,8}\\b|\\b(?:rgb|rgba|hsl|hsla)\\()/'
const rawFontSizePattern = '/\\b\\d+(?:\\.\\d+)?px\\b/'
const rawFontWeightPattern = '/\\b[1-9]00\\b/'
const rawLineHeightPattern = '/\\b(?:\\d+(?:\\.\\d+)?(?:px)?)\\b/'
const rawSpacingPattern = '/\\b\\d+(?:\\.\\d+)?px\\b/'
const rawStrokeWidthPattern = '/\\b\\d+(?:\\.\\d+)?px\\b/'
const rawVisualSizePattern =
  '/\\b(?:5|6|12|14|16|18|20|22|24|26|27|32|36|38|40|44|46|48|60|74|88)px\\b/'

/** @type {import('stylelint').Config} */
const config = {
  extends: [stylelintConfigStandard, stylelintConfigTailwindcss],
  overrides: [
    {
      files: ['src/**/*.module.css'],
      rules: {
        'declaration-property-value-disallowed-list': {
          '/.*/': [rawColorValuePattern],
          'font-size': [rawFontSizePattern],
          'font-weight': [rawFontWeightPattern],
          'line-height': [rawLineHeightPattern],
          '/^(?:gap|row-gap|column-gap|margin|margin-top|margin-bottom|margin-left|margin-right|padding|padding-top|padding-bottom|padding-left|padding-right|padding-inline)$/':
            [rawSpacingPattern],
          '/^(?:border|border-top|border-right|border-bottom|border-left|outline|outline-offset)$/':
            [rawStrokeWidthPattern],
          '/^(?:width|height|min-width|min-height|max-width|max-height|flex)$/': [
            rawVisualSizePattern,
          ],
        },
      },
    },
  ],
  rules: {
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'no-descending-specificity': null,
    'color-function-notation': 'modern',
    'alpha-value-notation': 'percentage',
    'unit-allowed-list': [
      'em',
      'rem',
      '%',
      'px',
      'vh',
      'vw',
      'dvh',
      'dvw',
      'fr',
      'ch',
      'ex',
      's',
      'ms',
      'deg',
      'turn',
      'rad',
      'lh',
    ],
    'font-family-name-quotes': 'always-where-recommended',
    'font-weight-notation': 'numeric',
    'declaration-block-no-redundant-longhand-properties': true,
    'shorthand-property-no-redundant-values': true,
    'media-feature-range-notation': 'context',
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'local'] }],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'layer',
          'apply',
          'theme',
          'variant',
          'custom-variant',
          'utility',
          'config',
          'import',
          'tailwind',
        ],
      },
    ],
    'property-no-vendor-prefix': [
      true,
      {
        ignoreProperties: [
          'appearance',
          'backdrop-filter',
          'text-size-adjust',
          'text-decoration',
          'font-smoothing',
          'overflow-scrolling',
          'tap-highlight-color',
          'user-select',
        ],
      },
    ],
    'value-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'media-feature-name-no-vendor-prefix': true,
    'at-rule-no-vendor-prefix': true,
  },
}

export default config
