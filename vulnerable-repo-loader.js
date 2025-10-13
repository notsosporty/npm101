// vulnerable-repo-loader.js - "Dynamic git fetcher for admin dashboard"
const express = require('express');
const { exec } = require('child_process');
const app = express();

app.use(express.json());

app.post('/load-repo', (req, res) => {
  const { repoUrl } = req.body;  // Unsanitized from React form

  // Vulnerable: exec with shell callback, no escaping
  exec(`git clone ${repoUrl} ./temp-repo`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ success: true, output: stdout });
  });
});

app.listen(3000, () => console.log('Server running on 3000'));

// React side (for completeness) - Form in App.tsx
// <form onSubmit={(e) => { e.preventDefault(); fetch('/load-repo', {method: 'POST', body: JSON.stringify({repoUrl: inputValue})}); }}>
// Test: POST { "repoUrl": "https://github.com/user/repo.git && rm -rf /home/user/*" }  # Nukes your dir
