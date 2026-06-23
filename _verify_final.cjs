async function check() {
  const checks = [
    ["Razorpay API", "http://localhost:5000/api/trpc/payment.createOrder?batch=1",
      { "0": { json: { amount: 1, currency: "INR", donorName: "T", donorEmail: "t@t.com" } } },
      function(t) { return t.includes("orderId"); }],
    ["Server reachable", "http://localhost:5000/",
      null,
      function(t) { return t.length > 0; }],
  ];

  for (const c of checks) {
    try {
      const res = await fetch(c[1], { method: c[2] ? "POST" : "GET", headers: { "Content-Type": "application/json" }, body: c[2] ? JSON.stringify(c[2]) : undefined });
      const text = await res.text();
      const ok = c[3](text);
      console.log((ok ? "✅" : "❌") + " " + c[0] + " (" + res.status + ")");
    } catch (e) {
      console.log("❌ " + c[0] + ": " + e.message);
    }
  }
}
check().catch(e => console.log(e.message));
