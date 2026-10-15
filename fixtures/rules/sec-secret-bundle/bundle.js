// motomation rule fixture (v2.7.0): a client bundle with a deliberate secret (made-up value, not a real credential).
// Expected with --rules --tier 1: fails sec-07 only (K1); warns sec-06 (token in localStorage) and sec-09 (email in a log).
const settings = { client_secret: "Fx7Kq2Lm9Pz4Rt8Wv3Yb6Nc1Hd5Js0Ga" };
function remember(res) { localStorage.setItem("authToken", res.token); console.log("signed in", res.user.email); }
window.__fixture = { settings, remember };
