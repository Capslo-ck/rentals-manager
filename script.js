// ---------- Password show/hide (shared by both pages) ----------
function togglePw(inputId, btnId){
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if(input.type === 'password'){
    input.type = 'text';
    btn.textContent = 'Hide';
  } else {
    input.type = 'password';
    btn.textContent = 'Show';
  }
}

const checkSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const crossSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12" stroke-linecap="round"/></svg>';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setStatus(iconEl, state){
  // state: 'ok' | 'bad' | ''
  iconEl.className = 'icon-right status-icon' + (state ? ' ' + (state === 'ok' ? 'ok' : 'bad') : '');
  iconEl.innerHTML = state === 'ok' ? checkSvg : state === 'bad' ? crossSvg : '';
}

function setHint(hintEl, text, state){
  hintEl.textContent = text;
  hintEl.className = 'hint' + (state === 'ok' ? ' ok-msg' : state === 'bad' ? ' err-msg' : '');
}

// =========================================================
// LOGIN PAGE
// =========================================================
const loginForm = document.getElementById('loginForm');
if(loginForm){
  const emailInput  = document.getElementById('email');
  const emailStatus = document.getElementById('emailStatus');
  const emailMsg    = document.getElementById('emailMsg');
  const pwInput     = document.getElementById('pw');
  const submitBtn   = document.getElementById('submitBtn');

  let emailValid = false;
  let pwValid = false;

  function updateLoginState(){
    submitBtn.disabled = !(emailValid && pwValid);
  }

  emailInput.addEventListener('input', ()=>{
    const value = emailInput.value.trim();
    emailInput.classList.remove('valid','invalid');
    if(value === ''){
      setStatus(emailStatus, '');
      setHint(emailMsg, '');
      emailValid = false;
    } else if(emailPattern.test(value)){
      emailInput.classList.add('valid');
      setStatus(emailStatus, 'ok');
      setHint(emailMsg, 'Looks good', 'ok');
      emailValid = true;
    } else {
      emailInput.classList.add('invalid');
      setStatus(emailStatus, 'bad');
      setHint(emailMsg, 'Enter a valid email address', 'bad');
      emailValid = false;
    }
    updateLoginState();
  });

  pwInput.addEventListener('input', ()=>{
    pwValid = pwInput.value.length > 0;
    pwInput.classList.remove('valid','invalid');
    if(pwInput.value.length > 0) pwInput.classList.add('valid');
    updateLoginState();
  });

  loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(emailValid && pwValid){
      submitBtn.textContent = 'Signing in...';
      // Hook up real authentication here.
    }
  });
}

// =========================================================
// SIGNUP PAGE
// =========================================================
const signupForm = document.getElementById('signupForm');
if(signupForm){
  const emailInput  = document.getElementById('semail');
  const emailStatus = document.getElementById('semailStatus');
  const emailMsg    = document.getElementById('semailMsg');
  const pwInput     = document.getElementById('spw');
  const pwHint      = document.getElementById('pwHint');
  const cpwInput    = document.getElementById('cpw');
  const cpwStatus   = document.getElementById('cpwStatus');
  const cpwMsg      = document.getElementById('cpwMsg');
  const termsInput  = document.getElementById('terms');
  const submitBtn   = document.getElementById('submitBtn');
  const checklist   = document.querySelectorAll('#pwChecklist .rule');

  let emailValid = false;
  let pwValid = false;
  let cpwValid = false;

  function updateSignupState(){
    submitBtn.disabled = !(emailValid && pwValid && cpwValid && termsInput.checked);
  }

  emailInput.addEventListener('input', ()=>{
    const value = emailInput.value.trim();
    emailInput.classList.remove('valid','invalid');
    if(value === ''){
      setStatus(emailStatus, '');
      setHint(emailMsg, '');
      emailValid = false;
    } else if(emailPattern.test(value)){
      emailInput.classList.add('valid');
      setStatus(emailStatus, 'ok');
      setHint(emailMsg, 'Looks good', 'ok');
      emailValid = true;
    } else {
      emailInput.classList.add('invalid');
      setStatus(emailStatus, 'bad');
      setHint(emailMsg, 'Enter a valid email address', 'bad');
      emailValid = false;
    }
    updateSignupState();
  });

  function checkConfirm(){
    const value = cpwInput.value;
    cpwInput.classList.remove('valid','invalid');
    if(value === ''){
      setStatus(cpwStatus, '');
      setHint(cpwMsg, '');
      cpwValid = false;
    } else if(value === pwInput.value && pwValid){
      cpwInput.classList.add('valid');
      setStatus(cpwStatus, 'ok');
      setHint(cpwMsg, 'Passwords match', 'ok');
      cpwValid = true;
    } else {
      cpwInput.classList.add('invalid');
      setStatus(cpwStatus, 'bad');
      setHint(cpwMsg, 'Passwords do not match', 'bad');
      cpwValid = false;
    }
    updateSignupState();
  }

  pwInput.addEventListener('input', ()=>{
    const value = pwInput.value;
    const rules = {
      len:     value.length >= 8,
      upper:   /[A-Z]/.test(value),
      num:     /[0-9]/.test(value),
      special: /[^A-Za-z0-9]/.test(value)
    };

    checklist.forEach(el=>{
      const rule = el.getAttribute('data-rule');
      el.classList.toggle('met', rules[rule]);
    });

    pwValid = Object.values(rules).every(Boolean);
    pwInput.classList.remove('valid','invalid');
    if(value.length > 0) pwInput.classList.add(pwValid ? 'valid' : 'invalid');

    setHint(pwHint, rules.len ? 'Length requirement met' : 'Must be at least 8 characters', rules.len ? 'ok' : '');

    checkConfirm();
    updateSignupState();
  });

  cpwInput.addEventListener('input', checkConfirm);
  termsInput.addEventListener('change', updateSignupState);

  signupForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(!submitBtn.disabled){
      submitBtn.textContent = 'Creating account...';
      // Hook up real account creation here.
    }
  });
}

// ---------- Aurora blobs are pure CSS, no JS needed ----------
