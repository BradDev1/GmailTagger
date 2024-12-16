const { google } = require('googleapis');

// Function to create or update a label
async function createOrUpdateLabel(auth, labelName) {
    const gmailClient = google.gmail({ version: 'v1', auth });  // Initialize the Gmail API client

    // Fetch the list of existing labels
    const labelRes = await gmailClient.users.labels.list({ userId: 'me' });
    
    // Check if the label already exists
    let label = labelRes.data.labels.find(l => l.name === labelName);

    // If the label does not exist, create it
    if (!label) {
        const newLabelRes = await gmailClient.users.labels.create({
            userId: 'me',
            resource: {
                name: labelName,  // Name of the label to be created
                labelListVisibility: 'labelShow',
                messageListVisibility: 'show',
            },
        });
        console.log(`Label created: ${newLabelRes.data.name}`);
        label = newLabelRes.data;  // Store the newly created label
    } else {
        console.log(`Label already exists: ${label.name}`);
    }

    return label;  // Return the label (either newly created or existing)
}

// Function to search for emails based on a query
async function searchEmails(auth, query) {
    const gmailClient = google.gmail({ version: 'v1', auth });
    let messages = [];
    let nextPageToken = null;

    // Fetch all emails that match the search query, handling pagination
    do {
        const res = await gmailClient.users.messages.list({
            userId: 'me',
            q: query,  // The search query
            pageToken: nextPageToken,  // Token to get the next page of results
        });

        // Add the fetched emails to the messages array
        if (res.data.messages) {
            messages = messages.concat(res.data.messages);
        }
        nextPageToken = res.data.nextPageToken;  // Update the next page token
    } while (nextPageToken);  // Continue fetching until all pages are processed

    return messages;  // Return all matching emails
}

// Function to add a label to an email
async function addLabelToEmail(auth, messageId, labelId) {
    const gmailClient = google.gmail({ version: 'v1', auth });
    
    // Retrieve the message details
    const message = await gmailClient.users.messages.get({ userId: 'me', id: messageId });
    const existingLabels = message.data.labelIds;  // Get the existing labels applied to the message

    // If the label is not already applied, add it
    if (!existingLabels.includes(labelId)) {
        await gmailClient.users.messages.modify({
            userId: 'me',
            id: messageId,
            resource: {
                addLabelIds: [labelId],  // Label to be added
            },
        });
        console.log(`Label added to message ID: ${messageId}`);
    } else {
        console.log(`Message ID ${messageId} already has this label.`);
    }
}

// Export the functions for use in other modules
module.exports = { createOrUpdateLabel, searchEmails, addLabelToEmail };
