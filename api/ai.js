export default function handler(req, res) {
  // 🌐 CORS Fix (wichtig für GitHub Pages)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // OPTIONS Request (Browser Preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Test Response (erstmal ohne OpenAI!)
  return res.status(200).json({
    result: "API funktioniert!"
  });
}
