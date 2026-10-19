/** The four questions on /rentals. The visible FAQ section (RentalsV3.tsx) and the JSON-LD (src/app/rentals/page.tsx) both read this list, so they can't drift apart. Keep /public/rentals.md in step by hand. */
export const FAQ: [string, string][] = [
  ["How much does Shortlist Stay cost?", "$50 a month per property. Pay and go, cancel anytime."],
  ["Do my guests have to download an app?", "No. Your house app opens from a link or a QR code, right in their browser."],
  ["Do you take a booking fee?", "No. When a guest books with you directly, they pay through your own Stripe or Square and the money goes to your bank."],
  ["How do guests get my app?", "Send the link by text or email, share it anywhere you already talk to guests, or leave a QR card in the house."],
];
