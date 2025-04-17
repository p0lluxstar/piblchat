import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import { globalIgnores } from 'eslint/config';
import prettier from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginVue from 'eslint-plugin-vue';

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^\\u0000', '^@?\\w', '^', '^\\.']],
        },
      ],
      'simple-import-sort/exports': 'error',
      'vue/no-unused-vars': 'warn', // Неиспользуемые переменные в шаблоне
      'vue/no-mutating-props': 'error', // Запрещает мутировать пропсы
      'vue/require-prop-types': 'warn', // Требует типизации пропсов
      'vue/require-default-prop': 'warn', // Требует значения по умолчанию для опциональных пропсов
      'vue/order-in-components': 'error', // Правильный порядок свойств в компонентах (data, props, methods и т.д.)
    },
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,
  prettier
);
