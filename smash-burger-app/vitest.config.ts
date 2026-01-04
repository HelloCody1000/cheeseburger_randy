import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 1. Enable Jest-like global variables (describe, it, expect)
    //    so you don't have to import them in every single test file.
    globals: true,

    // 2. Set the environment to 'node'
    //    Crucial for CDK/Lambda testing. If you leave this as 'jsdom' (browser),
    //    your backend tests might fail when trying to access Node-specific things.
    environment: 'node',

    // 3. (Optional) improved reporting
    reporters: ['verbose'],
    
    // 4. Exclude cdk.out and node_modules from being watched/tested
    exclude: ['node_modules', 'cdk.out', 'dist', '.idea', '.git', '.cache'],
  },
});