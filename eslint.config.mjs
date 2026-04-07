import { defineConfig, globalIgnores } from "eslint/config";
import nextJs from "@next/eslint-plugin-next";

const eslintConfig = defineConfig([
  {
    plugins: {
      "@next/next": nextJs,
    },
    rules: {
      ...nextJs.configs.recommended.rules,
      ...nextJs.configs["core-web-vitals"].rules,
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
