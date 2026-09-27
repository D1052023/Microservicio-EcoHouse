import type { AxeResults } from "jest-axe";

declare module "vitest" {
  interface Assertion {
    toHaveNoViolations(): AxeResults;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): AxeResults;
  }
}

export {};
