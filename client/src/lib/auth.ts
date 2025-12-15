export type AuthUser = { email: string; role: 'freelancer' | 'poster' };

export function getAuth(): AuthUser | null {
  try {
    const raw = localStorage.getItem('tg_auth_user');
    return raw ? JSON.parse(raw) as AuthUser : null;
  } catch {
    return null;
  }
}

export function requireAuthRedirect(navigate: (path: string) => void) {
  const u = getAuth();
  if (!u) {
    navigate('/auth');
  }
  return u;
}

export function signOut() {
  localStorage.removeItem('tg_auth_user');
}


