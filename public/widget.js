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
    // Check if mobile
    function isMobile() {
      return window.innerWidth < 480;
    }

    // Create container div
    const container = document.createElement('div');
    container.id = 'slp-widget-container';

    // Apply initial styles
    function applyContainerStyles() {
      const mobile = isMobile();
      container.style.cssText = `
        position: fixed;
        bottom: 16px;
        right: 16px;
        z-index: 999999;
        width: ${mobile ? '94vw' : 'min(480px, 92vw)'};
        height: 88px;
        ${mobile ? 'max-height: 70vh;' : ''}
        border-radius: 16px;
        overflow: hidden;
        opacity: 0;
        transition: opacity 300ms ease, height 200ms ease;
      `;
    }

    applyContainerStyles();

    // Function to gather page context and build iframe src
    function buildIframeSrc() {
      // Gather page context
      const pageTitle = document.title || '';
      const pagePath = window.location.pathname || '/';
      const descriptionMeta = document.querySelector('meta[name="description"]');
      let pageDescription = descriptionMeta ? descriptionMeta.getAttribute('content') || '' : '';

      // Truncate description to 200 chars
      if (pageDescription.length > 200) {
        pageDescription = pageDescription.substring(0, 200);
      }

      // Scrape and filter page headlines
      const headlines = [];
      const skipWords = ['home', 'menu', 'contact', 'footer', 'navigation', 'links', 'about', 'nav', 'header', 'copyright', 'subscribe', 'follow'];

      document.querySelectorAll('h1, h2, h3').forEach(function(el) {
        const text = el.textContent.trim();
        const lower = text.toLowerCase();
        if (
          text.length >= 4 &&
          headlines.length < 5 &&
          !skipWords.includes(lower) &&
          !/^\d+$/.test(text)
        ) {
          headlines.push(text.substring(0, 80));
        }
      });

      // Build iframe src with page context
      const params = new URLSearchParams({
        mode: 'widget',
        page_title: pageTitle,
        page_path: pagePath,
        page_desc: pageDescription,
        page_headlines: JSON.stringify(headlines)
      });

      return `https://${subdomain}.shortlistpass.com/embed?${params.toString()}`;
    }

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'slp-widget-iframe';
    iframe.src = buildIframeSrc();
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: 0;
      display: block;
    `;
    iframe.setAttribute('allowtransparency', 'true');

    // Fade in container after iframe loads
    iframe.addEventListener('load', function() {
      container.style.opacity = '1';
    });

    // Append iframe to container
    container.appendChild(iframe);

    // Append container to body
    document.body.appendChild(container);

    // Update container width on resize
    window.addEventListener('resize', applyContainerStyles);

    // Detect page navigation and update iframe
    let currentPath = window.location.pathname;
    let navigationDebounce = null;

    function checkNavigation() {
      const newPath = window.location.pathname;
      if (newPath !== currentPath) {
        currentPath = newPath;

        // Debounce navigation updates (300ms)
        clearTimeout(navigationDebounce);
        navigationDebounce = setTimeout(function() {
          // Fade out container before reload
          container.style.opacity = '0';

          // Listen for iframe reload, then fade back in
          function onReload() {
            container.style.opacity = '1';
            iframe.removeEventListener('load', onReload);
          }
          iframe.addEventListener('load', onReload);

          // Update iframe src with new page context
          iframe.src = buildIframeSrc();
        }, 300);
      }
    }

    // Listen for back/forward navigation
    window.addEventListener('popstate', checkNavigation);

    // Poll for SPA navigation (catches client-side routing)
    setInterval(checkNavigation, 500);

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

      // Apply height with bounds (min 88px, max 500px)
      const clampedHeight = Math.max(88, Math.min(e.data.height, 500));
      container.style.height = clampedHeight + 'px';

      // On mobile, also ensure max-height constraint
      if (isMobile()) {
        container.style.maxHeight = '70vh';
      }
    });
  }

  // Run init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
