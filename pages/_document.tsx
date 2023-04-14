import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" data-theme="lofi">
      <Head />
      <body>
        <div className="drawer drawer-end">
          <input id="chat-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <Main />
          </div>
          <div className="drawer-side">
            <label htmlFor="chat-drawer" className="drawer-overlay"></label>
            <div className="p-4 w-[40rem] bg-base-100 text-base-content">
              {/* ここにチャットのコンテンツを配置 */}
            </div>
          </div>
        </div>
        <NextScript />
      </body>
    </Html>
  )
}
