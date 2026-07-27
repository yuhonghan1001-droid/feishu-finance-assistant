import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "财税小助手｜企业内部原型",
  description:
    "基于权威公开财税规则的企业内部问答助手原型，提供制度引用、风险边界与人工转接。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
