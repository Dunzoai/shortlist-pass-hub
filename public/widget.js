(function() {
  'use strict';

  // Find the script tag that loaded this file
  const currentScript = document.currentScript ||
    document.querySelector('script[data-slp-subdomain]');

  if (!currentScript) {
    console.error('ShortlistPass: Could not find script tag');
    return;
  }

  // Read the subdomain from data attribute
  const subdomain = currentScript.getAttribute('data-slp-subdomain');

  if (!subdomain) {
    console.error('ShortlistPass: Missing data-slp-subdomain attribute');
    return;
  }

  // Wait for DOM to be ready
  function init() {
    // Create container div
    const container = document.createElement('div');
    container.id = 'slp-widget-container';
    container.style.cssText = `
      position: fixed;
      bottom: 16px;
      right: 16px;
      z-index: 999999;
      width: min(480px, 92vw);
      height: 88px;
      border-radius: 16px;
      overflow: hidden;
      transition: height 200ms ease;
    `;

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'slp-widget-iframe';
    iframe.src = `https://${subdomain}.shortlistpass.com/embed?mode=widget`;
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: 0;
      display: block;
    `;
    iframe.setAttribute('allowtransparency', 'true');

    // Append iframe to container
    container.appendChild(iframe);

    // Append container to body
    document.body.appendChild(container);

    // Listen for resize messages
    window.addEventListener('message', function(e) {
      // Security: only accept from *.shortlistpass.com
      try {
        const origin = new URL(e.origin);
        if (!origin.hostname.endsWith('shortlistpass.com')) return;
      } catch {
        return;
      }

      // Only handle resize messages
      if (e.data?.type !== 'slp_embed_resize') return;

      // Validate height is a number
      if (typeof e.data.height !== 'number') return;

      // Ignore non-finite heights
      if (!Number.isFinite(e.data.height)) return;

      // Verify message came from our iframe
      if (e.source !== iframe.contentWindow) return;

      // Apply height with bounds (min 88px, max 700px)
      const clampedHeight = Math.max(88, Math.min(e.data.height, 700));
      container.style.height = clampedHeight + 'px';
    });
  }

  // Run init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
