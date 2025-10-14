// vulnerable-report-executor.js - "Dynamic report generator"
const express = require('express');
const app = express();
app.use(express.json());

app.post('/run-report', (req, res) => {
  const { userReportCode } = req.body;  // Unsanitized from client or API

  // Vulnerable: eval on input—attacker sends 'require("child_process").execSync("ls /etc/")'
  try {
    const result = eval(userReportCode);  // Full Node context, no sandbox
    res.json({ success: true, output: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Running on 3000'));
