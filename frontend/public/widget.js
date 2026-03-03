/**
 * Aurora AI Platform - Widget Injector Script
 * Version: 1.0.0
 * 
 * Instructions: Add this to the <head> or <body> of your host HTML website.
 * It will parse data attributes and mount the isolated React Three Fiber iframe interface.
 */

(function () {
    // 1. Validate if we're already initialized to prevent double loading
    if (window.AuroraWidget) return;

    const API_BASE = "https://app.aurora-ai.com"; // Change in actual prod

    // 2. Discover configuration from the script tag attributes
    const scripts = document.getElementsByTagName('script');
    let currentScript = null;

    // Find the script pulling this exactly to extract the data attributes
    for (let script of scripts) {
        if (script.src.includes('widget.js')) {
            currentScript = script;
            break;
        }
    }

    if (!currentScript) {
        console.error("[Aurora AI] Could not find script tag. Initialization aborted.");
        return;
    }

    const agentId = currentScript.getAttribute('data-agent-id');
    const position = currentScript.getAttribute('data-position') || 'bottom-right'; // bottom-right, bottom-left

    if (!agentId) {
        console.error("[Aurora AI] Error: data-agent-id is missing from embed script.");
        return;
    }

    // 3. Inject Scoped Styling (No Tailwind, Vanilla scoped CSS to avoid conflicts)
    const style = document.createElement('style');
    style.innerHTML = `
        #aurora-ai-wrapper {
            position: fixed;
            z-index: 2147483647; /* Maximum possible z-index */
            bottom: ${position.includes('bottom') ? '20px' : 'auto'};
            right: ${position.includes('right') ? '20px' : 'auto'};
            left: ${position.includes('left') ? '20px' : 'auto'};
            width: 400px;
            height: 600px;
            pointer-events: none; /* Let clicks pass through transparent areas */
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: system-ui, -apple-system, sans-serif;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(139, 92, 246, 0.25);
            /* Initial state collapsed into a bubble */
            transform-origin: bottom right;
            border: 1px solid rgba(255,255,255, 0.1);
        }

        #aurora-ai-iframe {
            width: 100%;
            height: 100%;
            border: none;
            pointer-events: auto; /* Re-enable pointer events inside iframe */
            background: transparent;
        }

        @media (max-width: 600px) {
            #aurora-ai-wrapper {
                width: 100%;
                height: 100%;
                bottom: 0px;
                right: 0px;
                left: 0px;
                border-radius: 0px;
            }
        }
    `;
    document.head.appendChild(style);

    // 4. Construct Iframe Container
    const wrapper = document.createElement('div');
    wrapper.id = 'aurora-ai-wrapper';

    // Link directly to the specialized Next.js route for exactly only the chat 3D interface
    // Note: The host website passes the current URL as a query param so the RAG brain knows context!
    const hostUrl = encodeURIComponent(window.location.href);
    const iframeUrl = `/embed/${agentId}?host=${hostUrl}`;

    const iframe = document.createElement('iframe');
    iframe.id = 'aurora-ai-iframe';
    iframe.src = iframeUrl;
    iframe.allow = "microphone; camera *"; // CRITICAL: Allow cross-origin mic access for Voice AI
    iframe.title = "Aurora AI 3D Chat Interface";

    wrapper.appendChild(iframe);
    document.body.appendChild(wrapper);

    // 5. Establish postMessage API listener for bi-directional communication
    // E.g., The widget wants to minimize itself, or the host website wants to pass user login info
    window.addEventListener("message", (event) => {
        // if (event.origin !== API_BASE) return; // Security check in production

        try {
            const data = JSON.parse(event.data);
            if (data.type === 'AURORA_RESIZE') {
                if (data.state === 'minimized') {
                    wrapper.style.width = '80px';
                    wrapper.style.height = '80px';
                    wrapper.style.borderRadius = '40px';
                } else {
                    wrapper.style.width = '400px';
                    wrapper.style.height = '600px';
                    wrapper.style.borderRadius = '20px';
                }
            }
        } catch (e) { /* ignore non-json messages */ }
    });

    // Register globally
    window.AuroraWidget = {
        agentId: agentId,
        sendMessage: (msg) => {
            iframe.contentWindow.postMessage(JSON.stringify({ type: 'HOST_MESSAGE', text: msg }), '*');
        },
        toggleVisibility: () => {
            wrapper.style.display = wrapper.style.display === 'none' ? 'block' : 'none';
        }
    };

    console.log(`[Aurora AI] Widget initialized for Agent: ${agentId}`);
})();
