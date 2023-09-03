// cookieUtils.js

// Retrieve the entire cookie string
function getAllCookies() {
  return document.cookie;
}

// Split the cookie string into individual cookies
function parseCookies(cookieString) {
  return cookieString.split('; ').reduce((cookies, cookie) => {
    const [name, value] = cookie.split('=');
    cookies[name] = decodeURIComponent(value);
    return cookies;
  }, {});
}

// Get the value of a specific cookie by name
function getCookieValue(cookieName) {
  const cookies = parseCookies(getAllCookies());
  return cookies[cookieName] || null;
}
// Function to get the value of the session cookie
function getSessionCookie() {
  const cookies = document.cookie.split('; ');

  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === 'session') {
      return decodeURIComponent(value);
    }
  }

  return null; // Return null if the session cookie is not found
}

// Export the functions as part of a module
export { getCookieValue, getSessionCookie };
