const express = require('express');
const axios = require('axios');
const { WebClient } = require('@slack/web-api');

const app = express();
app.use(express.json());

const slackToken = process.env.SLACK_BOT_TOKEN;
const webClient = new WebClient(slackToken);
const channelId = process.env.SLACK_CHANNEL_ID;

app.post('/api/trigger-workflow', async (req, res) => {
  const githubToken = process.env.GITHUB_TOKEN;
  const repo = 'Ringzor09/adverlink';
  const workflowId = 'playwright.yml';

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

    // Post success message to Slack
    await webClient.chat.postMessage({
      channel: channelId,
      text: 'Playwright script ran successfully!'
    });

    res.status(200).send(); // Respond with a 200 status to avoid showing any text
  } catch (error) {
    console.error('Error triggering workflow:', error.response ? error.response.data : error.message);

    // Post error message to Slack
    await webClient.chat.postMessage({
      channel: channelId,
      text: `Error triggering workflow: ${error.response ? JSON.stringify(error.response.data) : error.message}`
    });

    res.status(500).send({ message: 'Error triggering workflow.', error: error.response ? error.response.data : error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
