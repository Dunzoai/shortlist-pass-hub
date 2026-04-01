export default function PitchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pitch-layout">
      <style>{`
        .pitch-layout nav,
        .pitch-layout header,
        [data-slp-widget],
        #slp-widget-root,
        .slp-chat-widget,
        iframe[src*="widget"],
        div[class*="widget"] {
          display: none !important;
        }
      `}</style>
      {children}
    </div>
  );
}
