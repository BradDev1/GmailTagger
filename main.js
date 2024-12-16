const { createOrUpdateLabel, searchEmails, addLabelToEmail } = require('./emailUtils');  // Import email-related functions
const oauth2Client = require('./auth');  // Import the OAuth2 client for authentication
const { google } = require('googleapis');  // Import the google APIs

// Function to process emails by applying a label based on a keyword
async function processEmails(labelName, keyword) {
    // Create or update the label if it doesn't exist
    await createOrUpdateLabel(oauth2Client, labelName);

    let addedCount = 0;  // Initialize counter for added labels
    // Search for emails using the specified keyword
    const messages = await searchEmails(oauth2Client, keyword);
    console.log(`Found ${messages.length} message(s)`);

    if (messages.length > 0) {
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });  // Initialize Gmail client
        // Retrieve the list of labels
        const labelRes = await gmail.users.labels.list({
            userId: 'me',  // Use 'me' to reference the authenticated user
        });
        // Find the label by name
        const label = labelRes.data.labels.find(l => l.name === labelName);

        if (label) {
            // For each message, add the label if it's not already applied
            for (const message of messages) {
                await addLabelToEmail(oauth2Client, message.id, label.id);  // Add label to the email
                addedCount++;  // Increment the counter
            }
        }
    }
    // Log the total number of emails labeled
    console.log(`Total number of messages added to the label '${labelName}': ${addedCount}`);
}

// Execute the function with a specified label and keyword, handling errors
processEmails("test-name-label","search-terms").catch(console.error);
