import stylelintConfigStandard from 'stylelint-config-standard'
import stylelintConfigTailwindcss from '@dreamsicle.io/stylelint-config-tailwindcss'

/** @type {import('stylelint').Config} */
const config = {
  extends: [stylelintConfigStandard, stylelintConfigTailwindcss],
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
