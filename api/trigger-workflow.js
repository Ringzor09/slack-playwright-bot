const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const githubToken = process.env.GITHUB_TOKEN; // Use environment variables
    const repo = 'Ringzor09/adverlink'; // Format: owner/repo
    const workflowId = 'playwright.yml';

    try {
      // Trigger the GitHub Actions workflow
      await axios.post(`https://api.github.com/repos/${repo}/actions/workflows/${workflowId}/dispatches`, {
        ref: 'main' // Branch name where the workflow is defined
      }, {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      res.status(200).json({ message: 'Workflow triggered successfully.' });
    } catch (error) {
      console.error('Error triggering workflow:', error);
      res.status(500).json({ message: 'Error triggering workflow.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
};
