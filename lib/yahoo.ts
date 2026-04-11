import YahooFinance from "yahoo-finance2";

// Removed undici global dispatcher to resolve 'module not found' error.
// The system will use the default Node.js fetch settings.
// [FORCE_RESYNC_2026_04_11_03_36]
const yahooFinance = new YahooFinance();

export default yahooFinance;
