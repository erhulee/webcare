import { moduleTools, defineConfig } from "@modern-js/module-tools";
import { modulePluginDoc } from "@modern-js/plugin-rspress";
export default defineConfig({
  plugins: [
    moduleTools(),
    modulePluginDoc({
      doc: {
        root: "docs",
        markdown: {
          defaultWrapCode: true
        }
      },
    }),
  ],
  // 指定构建预设配置
  buildPreset: "npm-library",
  buildConfig: {
    buildType: 'bundle',
    input: ['package/browser/index.ts'],
    format: "esm",
    splitting: true,
    autoExternal: {
      dependencies: false,
      peerDependencies: true,
    },
  },
});
