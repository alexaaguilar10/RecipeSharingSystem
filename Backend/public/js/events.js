export async function emitEvent(type, payload) {
  return fetch("http://localhost:3000/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type,
      payload,
      timestamp: Date.now()
    })
  });
}