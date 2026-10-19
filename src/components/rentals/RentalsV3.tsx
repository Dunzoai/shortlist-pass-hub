import Image from "next/image";
import { SIGNUP_HREF, DEMO_HREF } from "./tokens";

/** The v3 design for shortlistpass.com/rentals. The markup is the design file's, word for word, with its inline SVG drawings and the two filters (rough, grain) defined once at the top. The CSS below is the design's two animations plus the phone-width rules from the phone design file. */
const CSS = `.rs,.rs *{-webkit-font-smoothing:auto}
.rs,.rs *,.rs *::before,.rs *::after{box-sizing:content-box}
.rs a{color:#0b7a50}.rs a:hover{color:#08603f}
.rs a:focus-visible,.rs button:focus-visible{outline:3px solid #34d399;outline-offset:2px}
.rs .kn{padding:8px 10px;border-radius:10px;font-size:14px;line-height:1.35;color:#45423c;animation:hl 16s infinite}
.rs .sl{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-start;gap:8px;padding:14px;opacity:0;animation:cyc 16s infinite}
.rs .k2,.rs .s2x{animation-delay:4s}.rs .k3,.rs .s3x{animation-delay:8s}.rs .k4,.rs .s4x{animation-delay:12s}
@keyframes hl{0%,25%,100%{background:transparent;color:#45423c}3%,22%{background:#d7f5e8;color:#1a1c20}}
@keyframes cyc{0%{opacity:0;transform:translateY(10px)}4%,22%{opacity:1;transform:none}26%,100%{opacity:0;transform:none}}
.rs .ht{transform-box:fill-box;transform-origin:center;animation:rise 4.4s ease-in-out infinite}
@keyframes rise{0%{opacity:0;transform:translateY(16px)}25%,75%{opacity:1}100%{opacity:0;transform:translateY(-12px)}}
@media (prefers-reduced-motion: reduce){.rs .ht{animation:none}.rs .kn,.rs .sl{animation:none}.rs .sl.s1x{opacity:1}.rs .k1{background:#d7f5e8;color:#1a1c20}}
@media (max-width:700px){
.rs h1,.rs h2,.rs h3,.rs p,.rs .ey{text-wrap:wrap!important}
.rs .hd{padding:16px!important;flex-wrap:nowrap!important;gap:12px!important}
.rs .hd nav a:not(:last-child){display:none}
.rs .hd nav{gap:0!important}
.rs .hd nav a:last-child{padding:0 18px!important;font-size:14px!important}
.rs .lg{flex-direction:column;align-items:flex-start!important;gap:0!important}
.rs .lg span:first-child{font-size:24px!important;line-height:1}
.rs .lg span:last-child{font-size:12px!important}
.rs .s1,.rs .s3,.rs .s4,.rs .s5,.rs .s9,.rs .s6 .in,.rs .s7 .in,.rs .s10 .in,.rs .s11 .pc{flex-direction:column!important;flex-wrap:nowrap!important;align-items:stretch!important}
.rs .s1>*,.rs .s3>*,.rs .s4>*,.rs .s5>*,.rs .s9>*,.rs .s6 .in>*,.rs .s7 .in>*,.rs .s10 .in>*,.rs .s11 .pc>*{flex:none!important;min-width:0}
.rs .ey{font-size:12px!important}
.rs h2,.rs h3{letter-spacing:normal!important}
.rs .s2 h2{letter-spacing:-.015em!important}
.rs .s1{padding:24px 16px 56px!important;gap:16px!important;max-width:none!important}
.rs .hc{gap:16px!important}
.rs h1{font-size:52px!important;line-height:.95!important}
.rs .s1 p{font-size:17px!important}
.rs .s1 .hc>p:nth-of-type(2){font-size:26px!important}
.rs .hb{flex-direction:column!important;align-items:stretch!important;gap:10px!important}
.rs .hb a{min-height:52px;justify-content:center;padding:0!important;font-size:16px!important}
.rs .hn{text-align:center}
.rs .hv{height:440px;min-height:0!important;margin-top:8px}
.rs .hph{left:0!important;right:0!important;top:0!important;bottom:auto!important;height:300px;border-radius:24px!important}
.rs .hp{right:16px!important;bottom:0!important;width:190px!important;height:360px!important;border-radius:32px!important;padding:8px!important}
.rs .hps{border-radius:25px!important}
.rs .hpi{height:80px!important}
.rs .hpt{padding:10px 10px 0!important;gap:3px!important}
.rs .hpt span:first-child{font-size:8px!important}.rs .hpt span:last-child{font-size:19px!important}
.rs .hpq,.rs .hpw{display:none!important}
.rs .hpd{margin:10px 10px 0!important;padding:10px!important;border-radius:14px!important;gap:4px!important}
.rs .hpd span:nth-child(1),.rs .hpd span:nth-child(2){font-size:8px!important}.rs .hpd span:nth-child(3){font-size:22px!important}
.rs .hpg{margin:10px 10px 0!important;gap:6px!important}
.rs .hpgt{height:44px!important;border-radius:10px!important}
.rs .s2{padding:0 16px 24px!important;gap:10px!important}
.rs .s2 h2{font-size:42px!important;line-height:.98!important}
.rs .s3,.rs .s4,.rs .s5{padding:24px 16px 40px!important;gap:20px!important}
.rs .s5{padding-bottom:56px!important}
.rs .kp{border-radius:24px!important;padding:24px 20px!important;align-items:center!important;gap:12px!important}
.rs .karrow{display:none}
.rs .karrow2{display:block!important}
.rs .kc{width:100%;max-width:280px!important;padding:16px!important;gap:3px!important}
.rs .kc>span:nth-child(2){font-size:22px!important}
.rs .kn{padding:7px 9px}
.rs .kph{width:240px!important;height:260px!important;border-radius:32px!important}
.rs .kps{border-radius:25px!important}
.rs .kpn{padding:12px 12px 8px!important}
.rs .kpn2{font-size:18px!important}
.rs .sl{padding:12px}
.rs .tc,.rs .sc{gap:12px!important}
.rs h3{font-size:34px!important;line-height:1.02!important}
.rs .tc p,.rs .sc p,.rs .s9 p{font-size:16px!important}
.rs .bc{border-radius:24px!important;padding:20px!important;gap:14px!important}
.rs .bch{gap:6px!important}
.rs .bch span{padding:7px 12px!important;font-size:12px!important}
.rs .bcg{gap:10px!important}
.rs .bk{border-radius:16px!important}
.rs .bkp{height:90px!important;padding:8px!important}
.rs .bkb{padding:10px 10px 12px!important;gap:4px!important}
.rs .bkb span:nth-child(1){font-size:14px!important}.rs .bkb span:nth-child(2){font-size:12px!important;line-height:1.4!important}.rs .bkb span:nth-child(3){font-size:10px!important}
.rs .bp{align-self:stretch!important;margin-top:8px;padding:12px 14px!important;font-size:13px!important;line-height:1.4;gap:10px!important}
.rs .bpp{flex:0 0 auto;padding:4px 9px!important;font-size:11px!important}
.rs .lc{border-radius:24px!important;padding:24px 16px!important}
.rs .li{gap:8px!important}
.rs .lt{font-size:48px!important}
.rs .ln{padding:11px 13px!important;border-radius:14px!important}
.rs .ln span:first-child{font-size:10px!important}
.rs .s6 .in{padding:56px 16px 64px!important;gap:14px!important}
.rs .s6 h2{font-size:38px!important;line-height:1!important}
.rs .s6 p,.rs .s7 p{font-size:16px!important}
.rs .sc{gap:14px!important}
.rs .sw{margin-top:24px}
.rs .sp{max-width:400px!important}
.rs .s7 .in{padding:56px 16px!important;gap:16px!important}
.rs .s7 h2{font-size:42px!important;line-height:.98!important}
.rs .s7 .in>div:first-child{gap:16px!important}
.rs .aic{margin-top:6px}
.rs .ai1{max-width:280px!important;padding:12px 14px!important;font-size:14px!important}
.rs .ai2{max-width:310px!important;padding:14px!important}
.rs .ai2>span{font-size:14px!important}
.rs .ai2 div span:nth-child(1){font-size:15px!important}.rs .ai2 div span:nth-child(2){font-size:12px!important}
.rs .s8 .in{padding:56px 16px!important;gap:28px!important}
.rs .s8 h2{font-size:34px!important;line-height:1.02!important}
.rs .gg{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:28px 12px!important}
.rs .gf svg{width:140px!important;height:108px!important}
.rs .gf figcaption span:first-child{font-size:16px!important}.rs .gf figcaption span:last-child{font-size:13px!important}
.rs .s9{padding:64px 16px!important;gap:20px!important}
.rs .sk{border-radius:24px!important;padding:20px!important}
.rs .skc{max-width:none!important;border-radius:18px!important}
.rs .skh{padding:10px 12px!important}
.rs .skh span:first-child{width:28px!important;height:28px!important}
.rs .skh span:last-child{font-size:13px!important}
.rs .skp{height:170px!important;padding:10px!important}
.rs .skt{padding:12px!important;gap:8px!important;font-size:13px!important}
.rs .s10 .in{padding:56px 16px!important;gap:14px!important}
.rs .s10 h2{font-size:38px!important;line-height:1!important}
.rs .s10 .in>div:first-child{gap:14px!important}
.rs .bkr{gap:10px!important;margin-top:6px}
.rs .br{padding:16px 18px!important;gap:12px!important}
.rs .br span:first-child{font-size:14px!important}.rs .br span:last-child{font-size:16px!important}
.rs .br span.bz{font-size:34px!important}
.rs .s11{padding:64px 16px 56px!important}
.rs .pc{padding:28px 20px!important;gap:18px!important}
.rs .pl{gap:6px!important}
.rs .pp{font-size:64px!important}.rs .pm{font-size:22px!important}
.rs .pl>span:last-child{font-size:15px!important}
.rs .pu{font-size:15px!important;line-height:1.45;gap:10px!important}
.rs .pb{min-height:56px;justify-content:center;padding:0!important}
.rs .s12{padding:24px 16px 72px!important}
.rs .s12 p{font-size:40px!important;line-height:1!important}
.rs .fi{padding:48px 16px 28px!important}
.rs .ft{align-items:flex-start!important}
.rs .fn{font-size:36px!important}
}
`;

export default function RentalsV3() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
<svg width="0" height="0" aria-hidden="true" focusable="false" style={{ "position": "absolute" }}><defs>
<filter id="rough" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="1" seed="3" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="2.2"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="8"/><feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0.16 0"/></filter>
</defs></svg>
<div className="rs" style={{ "background": "#fbf8f0", "color": "#1a1c20", "fontFamily": "var(--font-schibsted), 'Helvetica Neue', Helvetica, sans-serif" }}>

  <header className="hd" style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "20px 48px", "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "16px", "flexWrap": "wrap" }}>
    <div className="lg" style={{ "display": "flex", "alignItems": "baseline", "gap": "10px" }}>
      <span style={{ "fontFamily": "var(--font-instrument), Georgia, serif", "fontSize": "28px" }}>Shortlist Stay</span>
      <span style={{ "fontSize": "13px", "color": "#6f6b60" }}>by The Shortlist</span>
    </div>
    <nav aria-label="Page" style={{ "display": "flex", "alignItems": "center", "gap": "24px", "flexWrap": "wrap" }}>
      <a href="#shorty" style={{ "color": "#1a1c20", "textDecoration": "none", "fontSize": "15px", "fontWeight": "600" }}>What it does</a>
      <a href="#ai" style={{ "color": "#1a1c20", "textDecoration": "none", "fontSize": "15px", "fontWeight": "600" }}>Found in AI</a>
      <a href="#price" style={{ "color": "#1a1c20", "textDecoration": "none", "fontSize": "15px", "fontWeight": "600" }}>Price</a>
      <a href={SIGNUP_HREF} style={{ "minHeight": "44px", "padding": "0 22px", "borderRadius": "999px", "background": "#1a1c20", "color": "#f6f1e4", "textDecoration": "none", "display": "inline-flex", "alignItems": "center", "fontSize": "15px", "fontWeight": "700" }}>Get started</a>
    </nav>
  </header>

  <section className="s1" style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "48px 48px 112px", "display": "flex", "flexWrap": "wrap", "gap": "48px", "alignItems": "center" }}>
    <div className="hc" style={{ "flex": "1 1 480px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "20px" }}>
      <div className="ey" style={{ "fontSize": "13px", "fontWeight": "700", "letterSpacing": "0.14em", "textTransform": "uppercase", "color": "#0b7a50" }}>For vacation rental hosts</div>
      <h1 style={{ "margin": "0", "fontFamily": "var(--font-instrument), Georgia, serif", "fontWeight": "400", "fontSize": "86px", "lineHeight": "0.92", "letterSpacing": "-0.015em", "textWrap": "balance" }}>Your rental has its own app.</h1>
      <p style={{ "margin": "0", "maxWidth": "540px", "fontSize": "19px", "lineHeight": "1.55", "color": "#45423c", "textWrap": "pretty" }}>Shorty answers your guests, shows them the best of the area, and keeps in touch long after checkout. When they come back, they book with you directly. We never take a booking fee.</p>
      <p style={{ "margin": "0", "fontFamily": "var(--font-instrument), Georgia, serif", "fontSize": "30px", "lineHeight": "1.1" }}>Your rental. Your guests. You keep them.</p>
      <div className="hb" style={{ "display": "flex", "gap": "12px", "flexWrap": "wrap", "alignItems": "center" }}>
        <a href={SIGNUP_HREF} style={{ "minHeight": "52px", "padding": "0 28px", "borderRadius": "999px", "background": "#1a1c20", "color": "#f6f1e4", "textDecoration": "none", "display": "inline-flex", "alignItems": "center", "fontSize": "16px", "fontWeight": "700" }}>Get started</a>
        <a href={DEMO_HREF} style={{ "minHeight": "52px", "padding": "0 28px", "borderRadius": "999px", "background": "#34d399", "color": "#0d2b20", "textDecoration": "none", "display": "inline-flex", "alignItems": "center", "fontSize": "16px", "fontWeight": "700" }}>Try the demo house</a>
      </div>
      <div className="hn" style={{ "fontSize": "14px", "color": "#6f6b60" }}>$50 a month per property. No download for guests.</div>
    </div>
    <div className="hv" style={{ "flex": "1 1 520px", "minWidth": "0", "position": "relative", "minHeight": "560px" }}>
      <div className="hph" style={{ "overflow": "hidden", "position": "absolute", "inset": "0 80px 0 0", "borderRadius": "28px", "background": "#d9cfb8", "display": "flex", "alignItems": "flex-end", "padding": "20px", "boxSizing": "border-box" }}>
        <Image src="/rentals/rentals-hero-porch.jpg" alt="Beach house porch at golden hour" fill sizes="(max-width: 700px) 100vw, 600px" priority style={{ objectFit: "cover" }} />
      </div>
      <div className="hp" style={{ "position": "absolute", "right": "0", "bottom": "-24px", "width": "270px", "height": "540px", "borderRadius": "40px", "background": "#14161a", "padding": "10px", "boxSizing": "border-box", "boxShadow": "0 24px 48px -28px rgba(26,28,32,0.55)" }}>
        <div className="hps" style={{ "width": "100%", "height": "100%", "borderRadius": "32px", "background": "#fbf8f0", "overflow": "hidden", "display": "flex", "flexDirection": "column" }}>
          <div className="hpi" style={{ "overflow": "hidden", "position": "relative", "height": "120px", "background": "#e9c98f" }}>
        <Image src="/rentals/rentals-phone-house.jpg" alt="Raised beach house at sunrise" fill sizes="270px" style={{ objectFit: "cover" }} /></div>
          <div className="hpt" style={{ "padding": "14px 14px 0", "display": "flex", "flexDirection": "column", "gap": "4px" }}>
            <span style={{ "fontSize": "9px", "fontWeight": "700", "letterSpacing": "0.14em", "color": "#0b7a50" }}>WELCOME IN</span>
            <span style={{ "fontFamily": "var(--font-instrument), Georgia, serif", "fontSize": "24px", "lineHeight": "1" }}>The Beach House</span>
          </div>
          <div className="hpq" style={{ "margin": "12px 14px 0", "padding": "8px 12px", "borderRadius": "999px", "border": "1px solid #1a1c20", "fontSize": "11px", "color": "#6f6b60" }}>Ask anything about your stay</div>
          <div className="hpd" style={{ "margin": "12px 14px 0", "padding": "12px", "borderRadius": "16px", "background": "#14161a", "color": "#f6f1e4", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
            <span style={{ "fontSize": "9px", "fontWeight": "700", "letterSpacing": "0.14em", "color": "#34d399" }}>YOUR STAY</span>
            <span style={{ "fontSize": "9px", "color": "#c9c3b3" }}>FRONT DOOR</span>
            <span style={{ "fontFamily": "var(--font-instrument), Georgia, serif", "fontSize": "26px", "letterSpacing": "0.08em" }}>4821</span>
            <span className="hpw" style={{ "fontSize": "10px", "color": "#c9c3b3" }}>Wi-Fi: BeachHouse_Guest</span>
          </div>
          <div className="hpg" style={{ "margin": "12px 14px 0", "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px" }}>
            <div className="hpgt" style={{ "overflow": "hidden", "position": "relative", "height": "56px", "borderRadius": "12px", "background": "#e9c98f" }}>
        <Image src="/rentals/rentals-phone-tile-1.jpg" alt="Fried shrimp basket" fill sizes="120px" style={{ objectFit: "cover" }} /></div>
            <div className="hpgt" style={{ "overflow": "hidden", "position": "relative", "height": "56px", "borderRadius": "12px", "background": "#c9d3d8" }}>
        <Image src="/rentals/rentals-phone-tile-2.jpg" alt="Boardwalk over the dunes to the ocean" fill sizes="120px" style={{ objectFit: "cover" }} /></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section className="s2" id="shorty" style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "0 48px 48px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
    <div className="ey" style={{ "fontSize": "13px", "fontWeight": "700", "letterSpacing": "0.14em", "textTransform": "uppercase", "color": "#0b7a50" }}>Meet Shorty, your house's front desk</div>
    <h2 style={{ "margin": "0", "maxWidth": "900px", "fontFamily": "var(--font-instrument), Georgia, serif", "fontWeight": "400", "fontSize": "64px", "lineHeight": "0.95", "letterSpacing": "-0.015em", "textWrap": "balance" }}>He answers. He guides. He keeps in touch.</h2>
  </section>

  <section className="s3" style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "48px 48px", "display": "flex", "flexWrap": "wrap", "gap": "56px", "alignItems": "center" }}>
    <div className="kp" style={{ "flex": "1 1 560px", "minWidth": "0", "borderRadius": "28px", "background": "#d7f5e8", "padding": "40px", "boxSizing": "border-box", "display": "flex", "flexWrap": "wrap", "gap": "20px", "alignItems": "center", "justifyContent": "center" }}>
      <div className="kc" style={{ "flex": "1 1 230px", "maxWidth": "250px", "background": "#ffffff", "border": "1px solid #e6dfcc", "borderRadius": "18px", "padding": "18px", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "gap": "4px", "boxShadow": "0 18px 36px -26px rgba(26,28,32,0.5)" }}>
        <span style={{ "fontSize": "11px", "fontWeight": "800", "letterSpacing": "0.12em", "color": "#0b7a50" }}>YOUR HOUSE NOTES</span>
        <span style={{ "fontFamily": "var(--font-instrument), Georgia, serif", "fontSize": "24px", "lineHeight": "1.1", "paddingBottom": "6px", "borderBottom": "1px solid #e6dfcc", "marginBottom": "4px" }}>What Shorty knows</span>
        <div className="kn k1">Pool closes at 9. No glass out there.</div>
        <div className="kn k2">Extra towels: hall closet, top shelf.</div>
        <div className="kn k3">Checkout 10am. Trash to the curb.</div>
        <div className="kn k4">Something broken? Text me: 843-555-0142</div>
      </div>
      <svg className="karrow" aria-hidden="true" width="40" height="24" viewBox="0 0 40 24" fill="none" stroke="#1a1c20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h34M28 4l8 8-8 8"/></svg><svg className="karrow2" aria-hidden="true" width="24" height="32" viewBox="0 0 24 32" fill="none" stroke="#1a1c20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "none" }}><path d="M12 2v26M4 20l8 8 8-8"/></svg>
      <div className="kph" style={{ "flex": "0 0 240px", "height": "300px", "borderRadius": "34px", "background": "#14161a", "padding": "8px", "boxSizing": "border-box", "boxShadow": "0 24px 48px -28px rgba(26,28,32,0.55)" }}>
        <div className="kps" style={{ "width": "100%", "height": "100%", "borderRadius": "27px", "background": "#fbf8f0", "overflow": "hidden", "display": "flex", "flexDirection": "column" }}>
          <div className="kpn" style={{ "padding": "14px 14px 10px", "borderBottom": "1px solid #e6dfcc", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
            <span style={{ "fontSize": "9px", "fontWeight": "700", "letterSpacing": "0.14em", "color": "#0b7a50" }}>ASK SHORTY</span>
            <span className="kpn2" style={{ "fontFamily": "var(--font-instrument), Georgia, serif", "fontSize": "19px", "lineHeight": "1" }}>The Beach House</span>
          </div>
          <div style={{ "position": "relative", "flex": "1 1 auto" }}>
            <div className="sl s1x">
              <div style={{ "alignSelf": "flex-end", "maxWidth": "170px", "padding": "9px 12px", "borderRadius": "14px", "background": "#1a1c20", "color": "#f6f1e4", "fontSize": "13px", "lineHeight": "1.4" }}>can we swim tonight?</div>
              <div style={{ "alignSelf": "flex-start", "maxWidth": "185px", "padding": "9px 12px", "borderRadius": "14px", "background": "#ffffff", "border": "1px solid #e6dfcc", "fontSize": "13px", "lineHeight": "1.4" }}>Pool's open till 9. Cans and plastic only out there, no glass.</div>
            </div>
            <div className="sl s2x">
              <div style={{ "alignSelf": "flex-end", "maxWidth": "170px", "padding": "9px 12px", "borderRadius": "14px", "background": "#1a1c20", "color": "#f6f1e4", "fontSize": "13px", "lineHeight": "1.4" }}>where are the extra towels</div>
              <div style={{ "alignSelf": "flex-start", "maxWidth": "185px", "padding": "9px 12px", "borderRadius": "14px", "background": "#ffffff", "border": "1px solid #e6dfcc", "fontSize": "13px", "lineHeight": "1.4" }}>Hall closet, top shelf.</div>
            </div>
            <div className="sl s3x">
              <div style={{ "alignSelf": "flex-end", "maxWidth": "170px", "padding": "9px 12px", "borderRadius": "14px", "background": "#1a1c20", "color": "#f6f1e4", "fontSize": "13px", "lineHeight": "1.4" }}>what time do we leave sunday?</div>
              <div style={{ "alignSelf": "flex-start", "maxWidth": "185px", "padding": "9px 12px", "borderRadius": "14px", "background": "#ffffff", "border": "1px solid #e6dfcc", "fontSize": "13px", "lineHeight": "1.4" }}>Checkout's at 10. Just roll the trash to the curb on your way out.</div>
            </div>
            <div className="sl s4x">
              <div style={{ "alignSelf": "flex-end", "maxWidth": "170px", "padding": "9px 12px", "borderRadius": "14px", "background": "#1a1c20", "color": "#f6f1e4", "fontSize": "13px", "lineHeight": "1.4" }}>the AC stopped working</div>
              <div style={{ "alignSelf": "flex-start", "maxWidth": "185px", "padding": "9px 12px", "borderRadius": "14px", "background": "#ffffff", "border": "1px solid #e6dfcc", "fontSize": "13px", "lineHeight": "1.4" }}>Sorry about that. Jenna's best by text at 843-555-0142. I just let her know too.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="tc" style={{ "flex": "1 1 420px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
      <div className="ey" style={{ "fontSize": "13px", "fontWeight": "700", "letterSpacing": "0.14em", "textTransform": "uppercase", "color": "#0b7a50" }}>Answers, trained by you</div>
      <h3 style={{ "margin": "0", "fontFamily": "var(--font-instrument), Georgia, serif", "fontWeight": "400", "fontSize": "46px", "lineHeight": "1", "textWrap": "balance" }}>Every answer, any hour. In your words.</h3>
      <p style={{ "margin": "0", "fontSize": "18px", "lineHeight": "1.55", "color": "#45423c" }}>Tell Shorty about your house once, the way you'd tell a friend. Wi-Fi, door code, checkout, the pool, the TV. He answers guests from what you taught him and never makes things up.</p>
      <p style={{ "margin": "0", "fontSize": "18px", "lineHeight": "1.55", "color": "#45423c" }}>Guests can still reach you. Shorty gives them your preferred way to get in touch, and lets you know when something needs you.</p>
    </div>
  </section>

  <section className="s4" style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "48px 48px", "display": "flex", "flexWrap": "wrap-reverse", "gap": "56px", "alignItems": "center" }}>
    <div className="tc" style={{ "flex": "1 1 420px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
      <div className="ey" style={{ "fontSize": "13px", "fontWeight": "700", "letterSpacing": "0.14em", "textTransform": "uppercase", "color": "#0b7a50" }}>The best of the area, from you</div>
      <h3 style={{ "margin": "0", "fontFamily": "var(--font-instrument), Georgia, serif", "fontWeight": "400", "fontSize": "46px", "lineHeight": "1", "textWrap": "balance" }}>The things that make a trip memorable.</h3>
      <p style={{ "margin": "0", "fontSize": "18px", "lineHeight": "1.55", "color": "#45423c" }}>Add your top local restaurants, rainy day activities, beach spots, kids' favorites and local perks, with your own notes. When a guest has the best taco of their trip, it came from your app.</p>
    </div>
    <div className="bc" style={{ "flex": "1 1 560px", "minWidth": "0", "borderRadius": "28px", "background": "#f0d9c4", "padding": "40px", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
      <div className="bch" style={{ "display": "flex", "gap": "8px", "flexWrap": "wrap" }}>
        <span style={{ "padding": "8px 14px", "borderRadius": "999px", "background": "#1a1c20", "color": "#f6f1e4", "fontSize": "13px", "fontWeight": "700" }}>Top restaurants</span>
        <span style={{ "padding": "8px 14px", "borderRadius": "999px", "background": "#ffffff", "fontSize": "13px", "fontWeight": "700" }}>Rainy day</span>
        <span style={{ "padding": "8px 14px", "borderRadius": "999px", "background": "#ffffff", "fontSize": "13px", "fontWeight": "700" }}>Beach</span>
        <span style={{ "padding": "8px 14px", "borderRadius": "999px", "background": "#ffffff", "fontSize": "13px", "fontWeight": "700" }}>With kids</span>
        <span style={{ "padding": "8px 14px", "borderRadius": "999px", "background": "#34d399", "color": "#0d2b20", "fontSize": "13px", "fontWeight": "700" }}>Local perks</span>
      </div>
      <div className="bcg" style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "14px" }}>
        <div className="bk" style={{ "borderRadius": "18px", "background": "#ffffff", "overflow": "hidden", "boxShadow": "0 18px 36px -26px rgba(26,28,32,0.5)", "transform": "rotate(-1.5deg)" }}>
          <div className="bkp" aria-hidden="true" style={{ "height": "120px", "background": "#e9c98f", "padding": "10px", "boxSizing": "border-box", "fontSize": "10px", "fontWeight": "700", "letterSpacing": "0.12em", "color": "#45423c" }}></div>
          <div className="bkb" style={{ "padding": "12px 14px 16px", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
            <span style={{ "fontSize": "15px", "fontWeight": "700" }}>Harborside Grill</span>
            <span style={{ "fontSize": "13px", "lineHeight": "1.45", "color": "#45423c" }}>"Shrimp basket on the deck at sunset."</span>
            <span style={{ "fontSize": "11px", "fontWeight": "700", "color": "#6f6b60" }}>Jenna's note</span>
          </div>
        </div>
        <div className="bk" style={{ "borderRadius": "18px", "background": "#ffffff", "overflow": "hidden", "boxShadow": "0 18px 36px -26px rgba(26,28,32,0.5)", "transform": "rotate(1.5deg) translateY(12px)" }}>
          <div className="bkp" style={{ "overflow": "hidden", "position": "relative", "height": "120px", "background": "#c9d3d8", "padding": "10px", "boxSizing": "border-box", "fontSize": "10px", "fontWeight": "700", "letterSpacing": "0.12em", "color": "#45423c" }}>
        <Image src="/rentals/rentals-pick-aquarium.jpg" alt="Sea turtle swimming in an aquarium" fill sizes="(max-width: 700px) 50vw, 300px" style={{ objectFit: "cover" }} /></div>
          <div className="bkb" style={{ "padding": "12px 14px 16px", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
            <span style={{ "fontSize": "15px", "fontWeight": "700" }}>The aquarium</span>
            <span style={{ "fontSize": "13px", "lineHeight": "1.45", "color": "#45423c" }}>"Our go-to when it rains. Go early."</span>
            <span style={{ "fontSize": "11px", "fontWeight": "700", "color": "#6f6b60" }}>Rainy day · Jenna's note</span>
          </div>
        </div>
      </div>
      <div className="bp" style={{ "alignSelf": "flex-start", "padding": "12px 16px", "borderRadius": "14px", "background": "#14161a", "color": "#f6f1e4", "fontSize": "14px", "display": "flex", "gap": "10px", "alignItems": "center" }}>
        <span className="bpp" style={{ "padding": "4px 10px", "borderRadius": "999px", "background": "#34d399", "color": "#0d2b20", "fontSize": "12px", "fontWeight": "800" }}>PERK</span>
        10% off at Low Tide Tacos for guests of The Beach House
      </div>
    </div>
  </section>

  <section className="s5" style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "48px 48px", "display": "flex", "flexWrap": "wrap", "gap": "56px", "alignItems": "center" }}>
    <div className="lc" style={{ "flex": "1 1 560px", "minWidth": "0", "borderRadius": "28px", "background": "#14161a", "padding": "40px", "boxSizing": "border-box", "display": "flex", "justifyContent": "center" }}>
      <div className="li" style={{ "width": "100%", "maxWidth": "360px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
        <div style={{ "textAlign": "center", "color": "#f6f1e4", "display": "flex", "flexDirection": "column", "gap": "2px", "paddingBottom": "12px" }}>
          <span className="lt" style={{ "fontFamily": "var(--font-instrument), Georgia, serif", "fontSize": "56px", "lineHeight": "1" }}>9:41</span>
          <span style={{ "fontSize": "13px", "color": "#c9c3b3" }}>Thursday</span>
        </div>
        <div className="ln" style={{ "padding": "12px 14px", "borderRadius": "16px", "background": "rgba(246,241,228,0.92)", "display": "flex", "flexDirection": "column", "gap": "3px" }}><span style={{ "fontSize": "11px", "fontWeight": "800", "letterSpacing": "0.08em", "color": "#6f6b60" }}>THE BEACH HOUSE · THU</span><span style={{ "fontSize": "14px", "lineHeight": "1.4" }}>Welcome tomorrow! Your door code and Wi-Fi are ready.</span></div>
        <div className="ln" style={{ "padding": "12px 14px", "borderRadius": "16px", "background": "rgba(246,241,228,0.92)", "display": "flex", "flexDirection": "column", "gap": "3px" }}><span style={{ "fontSize": "11px", "fontWeight": "800", "letterSpacing": "0.08em", "color": "#6f6b60" }}>THE BEACH HOUSE · SAT</span><span style={{ "fontSize": "14px", "lineHeight": "1.4" }}>Rain this afternoon. Here are Jenna's rainy day picks.</span></div>
        <div className="ln" style={{ "padding": "12px 14px", "borderRadius": "16px", "background": "rgba(246,241,228,0.92)", "display": "flex", "flexDirection": "column", "gap": "3px" }}><span style={{ "fontSize": "11px", "fontWeight": "800", "letterSpacing": "0.08em", "color": "#6f6b60" }}>THE BEACH HOUSE · SUN</span><span style={{ "fontSize": "14px", "lineHeight": "1.4" }}>Checkout's at 10 tomorrow. Here's your quick list.</span></div>
        <div className="ln" style={{ "padding": "12px 14px", "borderRadius": "16px", "background": "#34d399", "color": "#0d2b20", "display": "flex", "flexDirection": "column", "gap": "3px" }}><span style={{ "fontSize": "11px", "fontWeight": "800", "letterSpacing": "0.08em" }}>THE BEACH HOUSE · NOV</span><span style={{ "fontSize": "14px", "lineHeight": "1.4" }}>Missing the beach? November weekends just opened. Book direct.</span></div>
      </div>
    </div>
    <div className="tc" style={{ "flex": "1 1 420px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
      <div className="ey" style={{ "fontSize": "13px", "fontWeight": "700", "letterSpacing": "0.14em", "textTransform": "uppercase", "color": "#0b7a50" }}>Keeps in touch</div>
      <h3 style={{ "margin": "0", "fontFamily": "var(--font-instrument), Georgia, serif", "fontWeight": "400", "fontSize": "46px", "lineHeight": "1", "textWrap": "balance" }}>Texts, emails and push notifications. From your app.</h3>
      <p style={{ "margin": "0", "fontSize": "18px", "lineHeight": "1.55", "color": "#45423c" }}>A welcome before they arrive. A heads-up when it rains. A checkout reminder. Then, months later, a note that their week is open again. You stay in their pocket, not the booking site.</p>
    </div>
  </section>

  <section className="s6" style={{ "background": "#f6f1e4" }}>
    <div className="in" style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "104px 48px", "display": "flex", "flexWrap": "wrap", "gap": "64px", "alignItems": "center" }}>
      <div className="sc" style={{ "flex": "1 1 440px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
        <div className="ey" style={{ "fontSize": "13px", "fontWeight": "700", "letterSpacing": "0.14em", "textTransform": "uppercase", "color": "#0b7a50" }}>The stay they talk about</div>
        <h2 style={{ "margin": "0", "fontFamily": "var(--font-instrument), Georgia, serif", "fontWeight": "400", "fontSize": "54px", "lineHeight": "1", "letterSpacing": "-0.01em", "textWrap": "balance" }}>A house with its own app feels like a better house.</h2>
        <p style={{ "margin": "0", "maxWidth": "520px", "fontSize": "19px", "lineHeight": "1.55", "color": "#45423c" }}>The group shares it before they land. They find the taco truck you love, the rainy day plan, the discount down the street. The trip goes better, and your place is the reason.</p>
      </div>
      <div className="sw" style={{ "flex": "1 1 520px", "minWidth": "0" }}>
      <div className="sp" style={{ "position": "relative", "width": "100%", "maxWidth": "620px", "margin": "0 auto", "padding": "12px", "boxSizing": "border-box", "background": "#fffdf6", "borderRadius": "6px", "boxShadow": "0 24px 48px -30px rgba(26,28,32,0.55)", "transform": "rotate(-1.2deg)" }}>
        <div aria-hidden="true" style={{ "position": "absolute", "top": "-14px", "left": "50%", "width": "120px", "height": "28px", "marginLeft": "-60px", "background": "rgba(226,164,60,0.5)", "transform": "rotate(3deg)" }}></div>
        <svg viewBox="0 -70 600 530" width="100%" role="img" aria-label="Drawing of a small house with hearts floating up from the chimney" style={{ "display": "block" }}>
          <rect y="-70" width="600" height="530" filter="url(#grain)"/>
          <g filter="url(#rough)">
            <path d="M60 360 C 160 352, 260 366, 330 358 S 480 352, 540 362" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M120 360 l-4 -10 M128 360 l2 -11 M470 360 l-3 -10 M478 360 l3 -9" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M344 205 V150 H368 V205 Z" fill="#fffdf6" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M196 222 L300 140 L404 222 Z" fill="#e2a43c" transform="translate(8 6)"/>
            <rect x="214" y="216" width="172" height="144" fill="#d7f5e8" transform="translate(8 6)"/>
            <path d="M214 220 V360 H386 V220" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M192 226 L300 138 L408 226" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="300" cy="194" r="12" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M282 360 V308 a19 19 0 0 1 38 0 V360" fill="#34d399" transform="translate(5 4)"/>
            <path d="M282 360 V308 a19 19 0 0 1 38 0 V360" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="311" cy="334" r="2.5" fill="#1a1c20"/>
            <rect x="234" y="250" width="36" height="34" fill="#e9c98f" transform="translate(5 4)"/>
            <rect x="234" y="250" width="36" height="34" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M252 250 V284 M234 267 H270" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="332" y="250" width="36" height="34" fill="#e9c98f" transform="translate(5 4)"/>
            <rect x="332" y="250" width="36" height="34" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M350 250 V284 M332 267 H368" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M120 194 C 130 232, 160 252, 204 258" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M190 249 L205 258 L189 266" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M462 300 C 440 314, 424 316, 410 308" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M422 299 L409 308 L423 316" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M206 398 C 214 386, 224 378, 238 372" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M224 370 L239 372 L231 384" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <g filter="url(#rough)"><g transform="translate(362 118) scale(1.1)"><g className="ht" style={{ "animationDelay": "0s" }}><path d="M0 7 C -11 -1, -13 -12, -6 -15 C -2 -16, 0 -12, 0 -10 C 0 -12, 2 -16, 6 -15 C 13 -12, 11 -1, 0 7 Z" fill="#34d399" transform="translate(2.5 2)"/><path d="M0 7 C -11 -1, -13 -12, -6 -15 C -2 -16, 0 -12, 0 -10 C 0 -12, 2 -16, 6 -15 C 13 -12, 11 -1, 0 7 Z" fill="none" stroke="#1a1c20" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round"/></g></g><g transform="translate(388 80) scale(1.45)"><g className="ht" style={{ "animationDelay": "1.1s" }}><path d="M0 7 C -11 -1, -13 -12, -6 -15 C -2 -16, 0 -12, 0 -10 C 0 -12, 2 -16, 6 -15 C 13 -12, 11 -1, 0 7 Z" fill="#e2a43c" transform="translate(2.5 2)"/><path d="M0 7 C -11 -1, -13 -12, -6 -15 C -2 -16, 0 -12, 0 -10 C 0 -12, 2 -16, 6 -15 C 13 -12, 11 -1, 0 7 Z" fill="none" stroke="#1a1c20" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round"/></g></g><g transform="translate(354 42) scale(1.8)"><g className="ht" style={{ "animationDelay": "2.2s" }}><path d="M0 7 C -11 -1, -13 -12, -6 -15 C -2 -16, 0 -12, 0 -10 C 0 -12, 2 -16, 6 -15 C 13 -12, 11 -1, 0 7 Z" fill="#34d399" transform="translate(2.5 2)"/><path d="M0 7 C -11 -1, -13 -12, -6 -15 C -2 -16, 0 -12, 0 -10 C 0 -12, 2 -16, 6 -15 C 13 -12, 11 -1, 0 7 Z" fill="none" stroke="#1a1c20" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round"/></g></g><g transform="translate(404 16) scale(1.0)"><g className="ht" style={{ "animationDelay": "3.3s" }}><path d="M0 7 C -11 -1, -13 -12, -6 -15 C -2 -16, 0 -12, 0 -10 C 0 -12, 2 -16, 6 -15 C 13 -12, 11 -1, 0 7 Z" fill="#e2a43c" transform="translate(2.5 2)"/><path d="M0 7 C -11 -1, -13 -12, -6 -15 C -2 -16, 0 -12, 0 -10 C 0 -12, 2 -16, 6 -15 C 13 -12, 11 -1, 0 7 Z" fill="none" stroke="#1a1c20" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round"/></g></g></g>
          <text fontSize="27" fill="#1a1c20" x="34" y="148" style={{ "fontFamily": "var(--font-instrument), Georgia, serif", "fontStyle": "italic" }}>shared with</text><text fontSize="27" fill="#1a1c20" x="34" y="178" style={{ "fontFamily": "var(--font-instrument), Georgia, serif", "fontStyle": "italic" }}>the whole group</text>
          <text fontSize="27" fill="#1a1c20" x="470" y="290" style={{ "fontFamily": "var(--font-instrument), Georgia, serif", "fontStyle": "italic" }}>discover</text><text fontSize="27" fill="#1a1c20" x="470" y="320" style={{ "fontFamily": "var(--font-instrument), Georgia, serif", "fontStyle": "italic" }}>the area</text>
          <text fontSize="27" fill="#1a1c20" x="120" y="428" style={{ "fontFamily": "var(--font-instrument), Georgia, serif", "fontStyle": "italic" }}>remembered, long after checkout</text>
        </svg>
      </div>
      </div>
    </div>
  </section>

  <section className="s7" id="ai" aria-label="Found in AI" style={{ "background": "#14161a", "color": "#f6f1e4" }}>
    <div className="in" style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "96px 48px", "display": "flex", "flexWrap": "wrap", "gap": "48px", "alignItems": "center" }}>
      <div style={{ "flex": "1 1 520px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "20px" }}>
        <div className="ey" style={{ "fontSize": "13px", "fontWeight": "700", "letterSpacing": "0.14em", "textTransform": "uppercase", "color": "#34d399" }}>New guests, too</div>
        <h2 style={{ "margin": "0", "fontFamily": "var(--font-instrument), Georgia, serif", "fontWeight": "400", "fontSize": "64px", "lineHeight": "0.95", "letterSpacing": "-0.015em", "textWrap": "balance" }}>People ask AI where to stay now. <span style={{ "color": "#34d399" }}>We point them to you.</span></h2>
        <p style={{ "margin": "0", "maxWidth": "560px", "fontSize": "19px", "lineHeight": "1.55", "color": "#c9c3b3" }}>We're built into ChatGPT. When a traveler asks for a rental in your area, your place can come up. They open your app, ask Shorty anything, and request dates with you directly. Your address stays private until you're ready to share it.</p>
      </div>
      <div className="aic" style={{ "flex": "1 1 380px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
        <div className="ai1" style={{ "alignSelf": "flex-end", "maxWidth": "320px", "padding": "12px 16px", "borderRadius": "18px", "background": "#2a2e36", "fontSize": "15px", "lineHeight": "1.45" }}>Beach rental in North Myrtle Beach for 6, mid-November?</div>
        <div className="ai2" style={{ "alignSelf": "flex-start", "maxWidth": "360px", "padding": "16px", "borderRadius": "18px", "background": "#f6f1e4", "color": "#1a1c20", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
          <span style={{ "fontSize": "15px", "lineHeight": "1.45" }}>Here's one that fits:</span>
          <div style={{ "padding": "12px", "borderRadius": "12px", "background": "#ffffff", "border": "1px solid #e6dfcc", "display": "flex", "flexDirection": "column", "gap": "4px" }}>
            <span style={{ "fontSize": "16px", "fontWeight": "700" }}>The Beach House</span>
            <span style={{ "fontSize": "13px", "color": "#6f6b60" }}>North Myrtle Beach · Sleeps 6 · Pool</span>
            <span style={{ "alignSelf": "flex-start", "marginTop": "4px", "padding": "6px 12px", "borderRadius": "999px", "background": "#34d399", "color": "#0d2b20", "fontSize": "12px", "fontWeight": "700" }}>Ask about dates</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section className="s8" style={{ "background": "#f6f1e4" }}>
  <div className="in" style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "96px 48px", "display": "flex", "flexDirection": "column", "gap": "48px" }}>
    <div style={{ "display": "flex", "flexDirection": "column", "gap": "12px", "maxWidth": "820px" }}>
      <div className="ey" style={{ "fontSize": "13px", "fontWeight": "700", "letterSpacing": "0.14em", "textTransform": "uppercase", "color": "#0b7a50" }}>Getting them in</div>
      <h2 style={{ "margin": "0", "fontFamily": "var(--font-instrument), Georgia, serif", "fontWeight": "400", "fontSize": "46px", "lineHeight": "1", "textWrap": "balance" }}>Send your app however you already reach guests.</h2>
    </div>
    <div className="gg" style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", "gap": "32px" }}>
      <figure className="gf" style={{ "margin": "0", "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "10px", "textAlign": "center" }}>
        <svg viewBox="0 0 180 140" width="180" height="140" role="img" aria-label="Drawing: Text"><g filter="url(#rough)"><path d="M38 30 h100 a16 16 0 0 1 16 16 v40 a16 16 0 0 1 -16 16 h-62 l-22 18 4 -18 h-20 a16 16 0 0 1 -16 -16 v-40 a16 16 0 0 1 16 -16z" fill="#34d399" transform="translate(7 6)"/><path d="M38 30 h100 a16 16 0 0 1 16 16 v40 a16 16 0 0 1 -16 16 h-62 l-22 18 4 -18 h-20 a16 16 0 0 1 -16 -16 v-40 a16 16 0 0 1 16 -16z" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M48 58 h72 M48 76 h46" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
        <figcaption style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}><span style={{ "fontSize": "18px", "fontWeight": "700" }}>Text</span><span style={{ "fontSize": "15px", "lineHeight": "1.4", "color": "#45423c" }}>Before check-in, from your phone.</span></figcaption>
      </figure>
      <figure className="gf" style={{ "margin": "0", "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "10px", "textAlign": "center" }}>
        <svg viewBox="0 0 180 140" width="180" height="140" role="img" aria-label="Drawing: Email"><g filter="url(#rough)"><rect x="30" y="32" width="120" height="80" rx="6" fill="#e2a43c" transform="translate(7 6)"/><rect x="30" y="32" width="120" height="80" rx="6" fill="#fffdf6" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M33 37 L90 80 L147 37 M33 108 L74 72 M147 108 L106 72" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
        <figcaption style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}><span style={{ "fontSize": "18px", "fontWeight": "700" }}>Email</span><span style={{ "fontSize": "15px", "lineHeight": "1.4", "color": "#45423c" }}>In your welcome email.</span></figcaption>
      </figure>
      <figure className="gf" style={{ "margin": "0", "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "10px", "textAlign": "center" }}>
        <svg viewBox="0 0 180 140" width="180" height="140" role="img" aria-label="Drawing: Link"><g filter="url(#rough)"><rect x="22" y="34" width="136" height="72" rx="16" fill="#34d399" transform="translate(7 6)"/><rect x="22" y="34" width="136" height="72" rx="16" fill="#fffdf6" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><rect x="50" y="60" width="46" height="22" rx="11" transform="rotate(-25 73 71)" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><rect x="84" y="58" width="46" height="22" rx="11" transform="rotate(-25 107 69)" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
        <figcaption style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}><span style={{ "fontSize": "18px", "fontWeight": "700" }}>Link</span><span style={{ "fontSize": "15px", "lineHeight": "1.4", "color": "#45423c" }}>Anywhere you already talk.</span></figcaption>
      </figure>
      <figure className="gf" style={{ "margin": "0", "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "10px", "textAlign": "center" }}>
        <svg viewBox="0 0 180 140" width="180" height="140" role="img" aria-label="Drawing: QR code"><g filter="url(#rough)"><rect x="40" y="20" width="100" height="100" rx="6" fill="#e2a43c" transform="translate(7 6)"/><rect x="40" y="20" width="100" height="100" rx="6" fill="#fffdf6" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><rect x="48" y="28" width="26" height="26" rx="3" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><rect x="56" y="36" width="10" height="10" fill="#1a1c20"/><rect x="106" y="28" width="26" height="26" rx="3" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><rect x="114" y="36" width="10" height="10" fill="#1a1c20"/><rect x="48" y="86" width="26" height="26" rx="3" fill="none" stroke="#1a1c20" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><rect x="56" y="94" width="10" height="10" fill="#1a1c20"/><rect x="84" y="30" width="8" height="8" fill="#1a1c20"/><rect x="92" y="42" width="8" height="8" fill="#1a1c20"/><rect x="82" y="52" width="8" height="8" fill="#1a1c20"/><rect x="100" y="60" width="8" height="8" fill="#1a1c20"/><rect x="84" y="66" width="8" height="8" fill="#1a1c20"/><rect x="66" y="62" width="8" height="8" fill="#1a1c20"/><rect x="118" y="64" width="8" height="8" fill="#1a1c20"/><rect x="108" y="78" width="8" height="8" fill="#1a1c20"/><rect x="92" y="90" width="8" height="8" fill="#1a1c20"/><rect x="118" y="96" width="8" height="8" fill="#1a1c20"/><rect x="100" y="106" width="8" height="8" fill="#1a1c20"/><rect x="84" y="104" width="8" height="8" fill="#1a1c20"/><rect x="124" y="108" width="8" height="8" fill="#1a1c20"/></g></svg>
        <figcaption style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}><span style={{ "fontSize": "18px", "fontWeight": "700" }}>QR code</span><span style={{ "fontSize": "15px", "lineHeight": "1.4", "color": "#45423c" }}>A card in the house for the group.</span></figcaption>
      </figure>
    </div>
  </div>
  </section>

  <section className="s9" style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "112px 48px", "display": "flex", "flexWrap": "wrap-reverse", "gap": "56px", "alignItems": "center" }}>
    <div className="tc" style={{ "flex": "1 1 420px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
      <div className="ey" style={{ "fontSize": "13px", "fontWeight": "700", "letterSpacing": "0.14em", "textTransform": "uppercase", "color": "#0b7a50" }}>Runs your socials, too</div>
      <h3 style={{ "margin": "0", "fontFamily": "var(--font-instrument), Georgia, serif", "fontWeight": "400", "fontSize": "46px", "lineHeight": "1", "textWrap": "balance" }}>Connect your Instagram and Facebook. Shorty handles the rest.</h3>
      <p style={{ "margin": "0", "fontSize": "18px", "lineHeight": "1.55", "color": "#45423c" }}>He posts for you, answers comments and replies to DMs, all from what you've taught him. Someone asks "is it pet friendly?" at midnight, and they get an answer and a link to your app.</p>
    </div>
    <div className="sk" style={{ "flex": "1 1 560px", "minWidth": "0", "borderRadius": "28px", "background": "#e9c98f", "padding": "40px", "boxSizing": "border-box", "display": "flex", "justifyContent": "center" }}>
      <div className="skc" style={{ "width": "100%", "maxWidth": "380px", "borderRadius": "20px", "background": "#ffffff", "overflow": "hidden", "boxShadow": "0 24px 48px -28px rgba(26,28,32,0.55)" }}>
        <div className="skh" style={{ "padding": "12px 14px", "display": "flex", "alignItems": "center", "gap": "10px" }}>
          <span aria-hidden="true" style={{ "overflow": "hidden", "position": "relative", "width": "32px", "height": "32px", "borderRadius": "999px", "background": "#d9cfb8" }}>
        <Image src="/rentals/rentals-social-avatar.jpg" alt="Beach house front door" fill sizes="32px" style={{ objectFit: "cover" }} /></span>
          <span style={{ "fontSize": "14px", "fontWeight": "700" }}>thebeachhouse</span>
        </div>
        <div className="skp" style={{ "overflow": "hidden", "position": "relative", "height": "200px", "background": "#d9cfb8", "padding": "12px", "boxSizing": "border-box", "fontSize": "10px", "fontWeight": "700", "letterSpacing": "0.12em", "color": "#45423c" }}>
        <Image src="/rentals/rentals-social-deck.jpg" alt="Beach house deck at sunset" fill sizes="(max-width: 700px) 100vw, 380px" style={{ objectFit: "cover" }} /></div>
        <div className="skt" style={{ "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "10px", "fontSize": "14px", "lineHeight": "1.45" }}>
          <span><strong>thebeachhouse</strong> Golden hour from the deck. November weekends just opened.</span>
          <span><strong>sarah.k</strong> Is it pet friendly??</span>
          <span style={{ "paddingLeft": "14px", "borderLeft": "2px solid #e6dfcc" }}><strong>thebeachhouse</strong> Yes! Dogs under 40 lbs are welcome. Ask me anything here: link in bio.</span>
        </div>
      </div>
    </div>
  </section>

  <section className="s10" style={{ "background": "#f6f1e4" }}>
  <div className="in" style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "96px 48px", "display": "flex", "flexWrap": "wrap", "gap": "48px", "alignItems": "center" }}>
    <div style={{ "flex": "1 1 520px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
      <div className="ey" style={{ "fontSize": "13px", "fontWeight": "700", "letterSpacing": "0.14em", "textTransform": "uppercase", "color": "#0b7a50" }}>Book direct</div>
      <h2 style={{ "margin": "0", "fontFamily": "var(--font-instrument), Georgia, serif", "fontWeight": "400", "fontSize": "54px", "lineHeight": "1", "letterSpacing": "-0.01em", "textWrap": "balance" }}>We build the cart. Stripe and Square move the money.</h2>
      <p style={{ "margin": "0", "maxWidth": "560px", "fontSize": "19px", "lineHeight": "1.55", "color": "#45423c" }}>A guest requests dates, you confirm, they pay through your own Stripe or Square. It lands in your bank. No booking-site fee, and we never touch it.</p>
    </div>
    <div className="bkr" style={{ "flex": "1 1 380px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
      <div className="br" style={{ "padding": "20px 24px", "borderRadius": "18px", "background": "#ffffff", "border": "1px solid #e6dfcc", "display": "flex", "justifyContent": "space-between", "gap": "16px", "alignItems": "baseline" }}><span style={{ "fontSize": "16px", "color": "#45423c" }}>Booking fee on a direct booking</span><span className="bz" style={{ "fontFamily": "var(--font-instrument), Georgia, serif", "fontSize": "40px" }}>$0</span></div>
      <div className="br" style={{ "padding": "20px 24px", "borderRadius": "18px", "background": "#ffffff", "border": "1px solid #e6dfcc", "display": "flex", "justifyContent": "space-between", "gap": "16px", "alignItems": "baseline" }}><span style={{ "fontSize": "16px", "color": "#45423c" }}>Where the money goes</span><span style={{ "fontSize": "18px", "fontWeight": "700" }}>Your bank</span></div>
      <div className="br" style={{ "padding": "20px 24px", "borderRadius": "18px", "background": "#ffffff", "border": "1px solid #e6dfcc", "display": "flex", "justifyContent": "space-between", "gap": "16px", "alignItems": "baseline" }}><span style={{ "fontSize": "16px", "color": "#45423c" }}>Whose guests they are</span><span style={{ "fontSize": "18px", "fontWeight": "700" }}>Yours</span></div>
    </div>
  </div>
  </section>

  <section className="s11" id="price" style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "112px 48px 96px" }}>
    <div className="pc" style={{ "background": "#ffffff", "border": "1px solid #e6dfcc", "borderRadius": "24px", "boxShadow": "0 18px 36px -26px rgba(26,28,32,0.5)", "padding": "48px", "display": "flex", "flexWrap": "wrap", "gap": "48px", "alignItems": "center" }}>
      <div className="pl" style={{ "flex": "1 1 320px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
        <span style={{ "fontSize": "13px", "fontWeight": "700", "letterSpacing": "0.14em", "textTransform": "uppercase", "color": "#0b7a50" }}>One price, one house</span>
        <span className="pp" style={{ "fontFamily": "var(--font-instrument), Georgia, serif", "fontSize": "86px", "lineHeight": "0.9" }}>$50<span className="pm" style={{ "fontSize": "28px", "color": "#6f6b60" }}> / month</span></span>
        <span style={{ "fontSize": "16px", "color": "#45423c" }}>Per property. Pay and go. Cancel anytime.</span>
      </div>
      <ul className="pu" style={{ "flex": "1 1 360px", "minWidth": "0", "margin": "0", "padding": "0", "listStyle": "none", "display": "flex", "flexDirection": "column", "gap": "12px", "fontSize": "16.5px", "color": "#45423c" }}>
        <li>Your own house app, with Shorty trained by you</li>
        <li>Your local picks, perks and emergency info</li>
        <li>Texts, emails and push notifications to your guests</li>
        <li>Found in ChatGPT, book direct, no fees</li>
      </ul>
      <a className="pb" href={SIGNUP_HREF} style={{ "flex": "0 0 auto", "minHeight": "56px", "padding": "0 32px", "borderRadius": "999px", "background": "#1a1c20", "color": "#f6f1e4", "textDecoration": "none", "display": "inline-flex", "alignItems": "center", "fontSize": "17px", "fontWeight": "700" }}>Get started</a>
    </div>
  </section>

  <section className="s12" style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "48px 48px 120px", "textAlign": "center" }}>
    <p style={{ "margin": "0 auto", "maxWidth": "980px", "fontFamily": "var(--font-instrument), Georgia, serif", "fontSize": "64px", "lineHeight": "0.98", "letterSpacing": "-0.015em", "textWrap": "balance" }}>Make them love your place, enjoy the area, and come back through your own app.</p>
  </section>

  <footer style={{ "background": "#14161a", "color": "#f6f1e4" }}>
    <div className="fi" style={{ "maxWidth": "1280px", "margin": "0 auto", "padding": "64px 48px 32px", "display": "flex", "flexDirection": "column", "gap": "32px" }}>
      <div className="ft" style={{ "display": "flex", "flexWrap": "wrap", "gap": "28px", "justifyContent": "space-between", "alignItems": "flex-end" }}>
        <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
          <span className="fn" style={{ "fontFamily": "var(--font-instrument), Georgia, serif", "fontSize": "44px", "lineHeight": "1" }}>Shortlist Stay</span>
          <span style={{ "fontSize": "15px", "color": "#c9c3b3" }}>Powered by The Shortlist Pass Co.</span>
        </div>
        <div style={{ "display": "flex", "flexDirection": "column", "gap": "14px" }}>
          <div style={{ "display": "flex", "gap": "10px" }}>
          <a href="mailto:hello@shortlistpass.com" aria-label="Email hello@shortlistpass.com" style={{ "width": "48px", "height": "48px", "borderRadius": "999px", "border": "1px solid #3a3f49", "color": "#f6f1e4", "display": "inline-flex", "alignItems": "center", "justifyContent": "center", "textDecoration": "none" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5 12 13l8.5-6.5"/></svg></a>
          <a href="https://www.instagram.com/shortlistpass.com" aria-label="Instagram @shortlistpass.com" style={{ "width": "48px", "height": "48px", "borderRadius": "999px", "border": "1px solid #3a3f49", "color": "#f6f1e4", "display": "inline-flex", "alignItems": "center", "justifyContent": "center", "textDecoration": "none" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/></svg></a>
          <a href="https://www.facebook.com/shortlistpass" aria-label="Facebook /shortlistpass" style={{ "width": "48px", "height": "48px", "borderRadius": "999px", "border": "1px solid #3a3f49", "color": "#f6f1e4", "display": "inline-flex", "alignItems": "center", "justifyContent": "center", "textDecoration": "none" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.5 21v-8h3l.5-3.5h-3.5V7.6c0-1 .3-1.7 1.8-1.7H18V2.8c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.3H8V13h3v8"/></svg></a>
        </div>
          <a href="mailto:hello@shortlistpass.com" style={{ "color": "#c9c3b3", "textDecoration": "none", "fontSize": "15px", "fontWeight": "600" }}>hello@shortlistpass.com</a>
        </div>
      </div>
      <div style={{ "borderTop": "1px solid #2a2e36", "paddingTop": "20px", "display": "flex", "flexWrap": "wrap", "gap": "12px 24px", "justifyContent": "space-between", "fontSize": "13px", "color": "#8a8478" }}>
        <span>© 2026 The Shortlist Pass Co. Myrtle Beach, SC.</span>
        <span style={{ "display": "flex", "gap": "20px" }}><a href={SIGNUP_HREF} style={{ "color": "#8a8478", "textDecoration": "none" }}>Get started</a><a href={DEMO_HREF} style={{ "color": "#8a8478", "textDecoration": "none" }}>Try the demo house</a></span>
      </div>
    </div>
  </footer>
</div>

    </>
  );
}
