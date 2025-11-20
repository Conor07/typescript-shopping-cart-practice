import "@testing-library/jest-dom";

// Polyfill TextEncoder/TextDecoder for Node/Jest environment
// Node >= 11 has util.TextEncoder/TextDecoder
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { TextEncoder, TextDecoder } = require("util");
  // @ts-ignore
  if (typeof global.TextEncoder === "undefined")
    global.TextEncoder = TextEncoder;
  // @ts-ignore
  if (typeof global.TextDecoder === "undefined")
    global.TextDecoder = TextDecoder;
} catch (e) {
  // If require fails, ignore — environment may provide them already
}

// Provide a minimal matchMedia mock for components that use it (react-bootstrap Offcanvas)
if (typeof window.matchMedia === "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
