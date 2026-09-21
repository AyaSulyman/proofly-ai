"use client";

import { App, ConfigProvider } from "antd";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#7B2637",
          colorInfo: "#7B2637",
          colorSuccess: "#32745B",
          colorWarning: "#A2672F",
          colorError: "#A62F42",
          colorText: "#42151D",
          colorBgBase: "#FFFDF9",
          borderRadius: 12,
          fontFamily: "var(--font-poppins)",
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
