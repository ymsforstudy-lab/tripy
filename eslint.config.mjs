// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  ...storybook.configs["flat/recommended"],
  {
    // 기존 5곳(home, Toast, TripContext, useExchangeRates)이 걸려 있다. 동작을 바꾸는 리팩터링이라
    // 별도 작업으로 고치고, 그 전까지는 경고로 둔다. 새 코드에서는 이 패턴을 쓰지 않는다.
    rules: { "react-hooks/set-state-in-effect": "warn" },
  },
]);

export default eslintConfig;
