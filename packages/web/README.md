<div align="center">

# Sniper-SDK

前端监控 SDK 【毕设项目，还在迭代】

[![version](https://img.shields.io/npm/v/sniper-web?style=for-the-badge)](https://www.npmjs.com/package/sniper-web)
[![license](https://img.shields.io/npm/l/sniper-web?style=for-the-badge)](https://github.com/erhulee/sniper-sdk/blob/main/LICENSE)
[![size](https://img.shields.io/bundlephobia/minzip/sniper-sdk?style=for-the-badge)](https://bundlephobia.com/result?p=sniper-sdk)

</div>

## 📦 Installation

```bash
npm i sniper-web
```

## 🎯 Quickstart

在项目的顶层

```typescript
const webmonitor = new WebMonitor({
  appid: "appid",
});
// 只有 appid 是必填项

webmonitor.start();
```

## ⭐️ 支持特性

- 错误捕获：代码报错、资源加载报错、接口请求报错
- 性能数据：FCP、LCP、CLS、TTFB、FID、LongTask
- 网络测速：接口测速、资源测速
- 用户行为：跳出率
- 页面崩溃：基于 worker 的心跳检测
- 个性化指标：Long Task、Memory 页面内存、首屏加载时间
- 日志容灾：localstorage 备份
- 插件机制：所有特性都可以自定义选择
- 支持的 Web 框架：React

todo:

1. 日志去重复

## 🎲 具体配置项

```typescript
type Options = {
  appid: string;
  waitUidFilled: boolean;
  longtask_time?: number;
  sample_rate?: number;
  plugins?: Plugin[];
  threshold?: number;
  endpoint?: string;
  method: "post" | "get";
  senderType: "xhr" | "beacon";
};
```

| 参数名称      | 作用                        | 默认值                        |
| ------------- | --------------------------- | ----------------------------- |
| appid         | 应用标识                    | / 【必填项】                  |
| waitUidFilled | 是否等待 uid 获取后统一上报 | false                         |
| longtask_time | longtask_time               | 50(ms)                        |
| sample_rate   | 采样频率, 要求 0-1 之间     | 0.5                           |
| plugins       | 插件列表                    | 下面说明的全部插件            |
| threshold     | 统一日志上报数量            | 20                            |
| endpoint      | 日志请求地址                | https://bdul0j.laf.dev/logger |
| method        | 日志上报方法                | post                          |
| senderType    | 日志上报工具                | xhr                           |

### 已经内置实现的插件

| 插件名称           | 作用               | 注意事项                                                            |
| ------------------ | ------------------ | ------------------------------------------------------------------- |
| RrwebPlugin        | 现场录制插件       | 取消配置后，将不再上传用户行为录像， 适合有安全要求的项目           |
| CrashPlugin        | 页面崩溃           |                                                                     |
| HTTPPlugin         | 网络接口错误和测速 |                                                                     |
| JSErrorPlugin      | 运行时错误         |                                                                     |
| ResourcePlugin     | 资源错误和测速     |                                                                     |
| LongTimeTaskPlugin | 长任务监测         |                                                                     |
| WebVitalsPlugin    | webvital 指标检测  |                                                                     |
| EventsPlugin       | 用户行为数据记录   | 不会上报，作为其他 plugin 的数据源，会把数据存到 Monitor.eventStack |
| BounceRatePlugin   | 页面跳出率         | 页面跳出率，依赖 Monitor.eventStack                                 |

注意: 如果有自定义的插件，例如 CustomPlugin, 需要将默认的插件全部 import 一遍

```typescript
const webmonitor = new WebMonitor({
  appid: "appid",
  plugins: [
      new CustomPlugin(this),
      new RrwebPlugin(this),
      new HTTPPlugin(this),
      ...
  ]
});

```

## Uid 相关

### setUid

uid 一般和项目耦合的比较紧密，至少在用户登录后才可以拿到 uid，
所以 `monitor` 实例上会有一个 `setUid` 方法可以注册 `uid`

### waitUidFilled

- 如果项目不关心 uid 信息 ==> `waitUidFilled = false`: 直接上报不需要等待运行时 `setUid`

- 否则可以将 waitUidFilled 打开，让所有 log 带上 uid 信息
