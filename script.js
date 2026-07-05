// ---------- Password visibility toggle ----------
function togglePw(){
  const pw = document.getElementById('pw');
  const eye = document.getElementById('eye');
  if(pw.type === 'password'){
    pw.type = 'text';
    eye.innerHTML = '<path d="M17.9 17.9A10.9 10.9 0 0 1 12 19c-7 0-11-7-11-7a19.4 19.4 0 0 1 5.1-5.9M9.9 4.2A10.4 10.4 0 0 1 12 4c7 0 11 7 11 7a19.6 19.6 0 0 1-2.2 3.1M14.1 14.1A3 3 0 1 1 9.9 9.9" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 1l22 22" stroke-linecap="round"/>';
  } else {
    pw.type = 'password';
    eye.innerHTML = '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3"/>';
  }
}

// ---------- Theme toggle (visual only) ----------
document.querySelectorAll('.theme-toggle button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.theme-toggle button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ---------- Ambient skyline texture ----------
const sky = document.getElementById('skyline');
const cols = 24, rows = 16;
for(let r=0;r<rows;r++){
  for(let c=0;c<cols;c++){
    const s = document.createElement('span');
    if(Math.random() < 0.16){
      s.className = 'lit';
      s.style.animationDelay = (Math.random()*6).toFixed(2)+'s';
    }
    sky.appendChild(s);
  }
}

// ---------- Live correctness checker ----------
const emailInput   = document.getElementById('email');
const emailStatus  = document.getElementById('emailStatus');
const emailMsg     = document.getElementById('emailMsg');
const pwInput      = document.getElementById('pw');
const submitBtn    = document.getElementById('submitBtn');
const checklist     = document.querySelectorAll('#pwChecklist .rule');

const checkSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const crossSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6 6 18M6 6l12 12" stroke-linecap="round"/></svg>';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let emailValid = false;
let pwValid = false;

function updateSubmitState(){
  submitBtn.disabled = !(emailValid && pwValid);
}

// Live email validation — runs on every keystroke
emailInput.addEventListener('input', ()=>{
  const value = emailInput.value.trim();

  if(value === ''){
    emailInput.classList.remove('valid','invalid');
    emailStatus.innerHTML = '';
    emailStatus.className = 'icon-right status-icon';
    emailMsg.textContent = '';
    emailMsg.className = 'field-msg';
    emailValid = false;
  } else if(emailPattern.test(value)){
    emailInput.classList.remove('invalid');
    emailInput.classList.add('valid');
    emailStatus.innerHTML = checkSvg;
    emailStatus.className = 'icon-right status-icon ok';
    emailMsg.textContent = 'Looks good';
    emailMsg.className = 'field-msg ok-msg';
    emailValid = true;
  } else {
    emailInput.classList.remove('valid');
    emailInput.classList.add('invalid');
    emailStatus.innerHTML = crossSvg;
    emailStatus.className = 'icon-right status-icon bad';
    emailMsg.textContent = 'Enter a valid email address';
    emailMsg.className = 'field-msg';
    emailValid = false;
  }
  updateSubmitState();
});

// Live password rule checking — runs on every keystroke
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
  if(value.length > 0){
    pwInput.classList.add(pwValid ? 'valid' : 'invalid');
  }
  updateSubmitState();
});

// ---------- Submit handling ----------
document.getElementById('loginForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  if(emailValid && pwValid){
    submitBtn.textContent = 'Signing in...';
    // Hook up real authentication here.
  }
});
