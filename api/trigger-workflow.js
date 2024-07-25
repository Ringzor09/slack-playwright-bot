const express = require('express');
const axios = require('axios');
const { WebClient } = require('@slack/web-api'); // Slack Web API

const app = express();
app.use(express.json()); // Parse JSON payloads

const slackToken = 'xoxb-your-slack-bot-token'; // Replace with your Slack Bot Token
const webClient = new WebClient(slackToken);
const channelId = 'general'; // Replace with the ID of the channel where you want to post messages

// Endpoint to handle webhook requests
app.post('/api/trigger-workflow', async (req, res) => {
  const githubToken = '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'; // Replace with your GitHub token
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

    // Post a message to Slack
    await webClient.chat.postMessage({
      channel: channelId, // Replace with your channel ID
      text: 'Workflow triggered successfully.'
    });

    // Respond to the Slack request
    res.status(200).send(); // Send an empty response to Slack
  } catch (error) {
    console.error('Error triggering workflow:', error);

    // Post an error message to Slack
    await webClient.chat.postMessage({
      channel: channelId, // Replace with your channel ID
      text: 'Error triggering workflow.'
    });

    // Respond to the Slack request
    res.status(500).send(); // Send an empty response to Slack
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
