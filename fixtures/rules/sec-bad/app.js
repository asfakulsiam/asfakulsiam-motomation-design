// deliberately unsafe: a credential in the client and a URL fragment written as HTML
const config = { api_key: "q8Vn3LxT0pRw7ZsK2mYd4HfJ" };
addEventListener("DOMContentLoaded", () => { const out = document.getElementById("greeting"); if (out) out.innerHTML = decodeURIComponent(location.hash.slice(1)); });
