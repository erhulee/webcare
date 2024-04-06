import { moduleTools, defineConfig } from "@modern-js/module-tools";

export default defineConfig({
  plugins: [moduleTools()],
  // 指定构建预设配置
  buildPreset: "npm-library",
});
