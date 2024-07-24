// api/trigger-workflow.js
const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const githubToken = process.env.GITHUB_TOKEN; // Use environment variable
  const repo = 'Ringzor09/adverlink'; // Format: owner/repo
  const workflowId = 'playwright.yml'; // Updated to the filename

  console.log('Received request at /trigger-workflow');
  console.log('Request body:', req.body);

  try {
    // Trigger GitHub Actions workflow
    const response = await axios.post(`https://api.github.com/repos/${repo}/actions/workflows/${workflowId}/dispatches`, {
      ref: 'main'
    }, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    console.log('GitHub response:', response.data);

    res.status(200).json({ message: 'Workflow triggered successfully.' });
  } catch (error) {
    console.error('Error triggering workflow:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error triggering workflow.' });
  }
};
