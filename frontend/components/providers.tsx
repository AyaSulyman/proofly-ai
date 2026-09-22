"use client";

import { App, ConfigProvider } from "antd";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#E7B857",
          colorInfo: "#58D4D2",
          colorSuccess: "#58D4D2",
          colorWarning: "#F4D58A",
          colorError: "#E7B857",
          colorText: "#F8F2E4",
          colorTextSecondary: "#B5BFCC",
          colorBgBase: "#070C16",
          colorBgContainer: "#101A2A",
          colorBorder: "#2B394D",
          borderRadius: 12,
          fontFamily: "var(--font-poppins)",
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
