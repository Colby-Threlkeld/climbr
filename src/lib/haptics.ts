// Web + fallback: haptics are a no-op off native (design-system.md, Motion).
// Native builds pick up haptics.native.ts instead via Metro's platform extensions.
export const haptics = {
  tap(): void {},
  selection(): void {},
};
