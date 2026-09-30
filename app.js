// Register Function with LocalStorage
function register() {
  const name = document.getElementById('auth-name').value;
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-pass').value;

  if (!email || !password || !name) return showToast('Please fill all fields!');

  // Registered users ki list nikalna ya nayi array banana
  let users = JSON.parse(localStorage.getItem('registered_users')) || [];
  
  // Check agar email pehle se exist karti hai
  if (users.some(u => u.email === email)) {
    return showToast('Email already registered! Please Login.');
  }

  const newUser = { id: Date.now(), name, email, password };
  users.push(newUser);
  
  // LocalStorage mein save karna
  localStorage.setItem('registered_users', JSON.stringify(users));
  
  // Current user set karna
  currentUser = newUser;
  localStorage.setItem('user', JSON.stringify(currentUser));
  
  updateUserUI();
  toggleAuthModal();
  showToast(`Welcome ${name}! Account created.`);
}

// Login Function with LocalStorage
function login() {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-pass').value;

  if (!email || !password) return showToast('Please enter Email & Password!');

  let users = JSON.parse(localStorage.getItem('registered_users')) || [];
  
  // Check credentials
  const foundUser = users.find(u => u.email === email && u.password === password);

  if (foundUser) {
    currentUser = foundUser;
    localStorage.setItem('user', JSON.stringify(currentUser));
    updateUserUI();
    toggleAuthModal();
    showToast(`Welcome back, ${foundUser.name}!`);
  } else {
    showToast('Invalid Email or Password!');
  }
}
