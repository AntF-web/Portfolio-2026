(() => {
  // Change this SHA-256 hash when you change the editor password.
  // Use password-tool.html locally to generate a new hash.
  const EDITOR_PASSWORD_HASH = '0e494350f36abab50ce8a3b558cd5c2179c8c3d3aee6a9c4a8c907ffe060ff64';
  const SESSION_KEY = 'antEditorUnlockedSession';
  const REMEMBER_KEY = 'antEditorUnlockedRemembered';

  const $ = s => document.querySelector(s);

  async function sha256(value) {
    const data = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function isUnlocked() {
    return sessionStorage.getItem(SESSION_KEY) === EDITOR_PASSWORD_HASH ||
           localStorage.getItem(REMEMBER_KEY) === EDITOR_PASSWORD_HASH;
  }

  function unlock(remember = false) {
    sessionStorage.setItem(SESSION_KEY, EDITOR_PASSWORD_HASH);
    if (remember) localStorage.setItem(REMEMBER_KEY, EDITOR_PASSWORD_HASH);
    document.body.classList.remove('editor-locked');
    document.body.classList.add('editor-unlocked');
    const input = $('#editorPassword');
    if (input) input.value = '';
  }

  function lock() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    document.body.classList.remove('editor-unlocked');
    document.body.classList.add('editor-locked');
    const input = $('#editorPassword');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 50);
    }
  }

  const form = $('#editorLoginForm');
  const error = $('#editorLoginError');

  if (isUnlocked()) unlock(false);

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    if (error) error.textContent = '';
    const password = $('#editorPassword')?.value || '';
    const hash = await sha256(password);
    if (hash === EDITOR_PASSWORD_HASH) {
      unlock(Boolean($('#rememberEditor')?.checked));
    } else {
      if (error) error.textContent = 'Incorrect password.';
      const input = $('#editorPassword');
      if (input) {
        input.select();
        input.focus();
      }
    }
  });

  $('#lockEditor')?.addEventListener('click', lock);
})();