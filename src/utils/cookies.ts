function saveEmailToCookie(value: string): void {
  document.cookie = `okestro_email=${value}`;
}

function saveUserToCookie(value: string): void {
  document.cookie = `okestro_user=${value}`;
}

function getEmailFromCookie(): string {
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)okestro_email\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
}

function getUserFromCookie(): string {
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)okestro_user\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export {
  saveEmailToCookie,
  saveUserToCookie,
  getEmailFromCookie,
  getUserFromCookie,
  deleteCookie,
};
