export function logResponse(name, res) {
  console.log(`[${name}] Status: ${res.status}`);
  // console.log(`Response: ${res.body}`);

  if (res.status < 200 || res.status >= 300) {
    console.log(`[${name}] Response: ${res.body}`);
  }
}