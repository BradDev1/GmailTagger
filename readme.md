# Project: Gmail Labels Management Using Google API

## Description
This project leverages the Gmail API to search, analyze, and organize emails based on specific criteria. The main goal is to automatically apply labels to emails that match the search criteria while avoiding duplicate labels for already processed messages.

## Required
- **NodeJs**: Version 22.

## Features
- **Email Search**: Search messages by sender, subject, or other criteria using the `q` parameter.
- **Pagination**: Retrieve all emails beyond the 100-message limit with `nextPageToken`.
- **Label Management**: Conditionally add labels only if they are not already applied.
- **Result Tracking**: Log the number of messages processed and labeled.

## Technologies
- **Node.js**: For backend logic.
- **Gmail API**: To interact with email data.
- **Google OAuth2**: To authenticate and authorize access to Gmail accounts.

## How It Works
1. **Search Emails**:
   - The `searchEmails` function queries Gmail using a specific keyword.
   - Results are paginated, ensuring all messages are fetched using `nextPageToken`.

2. **Process Messages**:
   - For each email retrieved, the script checks if the desired label is already applied.
   - If not, the label is added using the `addLabelToEmail` function.

3. **Handle Large Datasets**:
   - The script handles Gmail's default limit of 100 messages per request by recursively fetching additional pages until all messages are processed.

4. **Track Results**:
   - Displays the total number of labeled emails and skips those already labeled to avoid redundancy.

## Example Workflow
1. Authenticate using your Google account via OAuth2.
2. Specify a search query (e.g., `from:example@example.com OR subject:important`).
3. Run the script to search, process, and label matching emails.
4. Check the console output for processing details and stats.

## Setup and Installation
0. Run the `getToken()` in auth.js script only once to retrieve the ACCESS_TOKEN and REFRESH_TOKEN follow tag in doc #ONE
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_folder>
   ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a Google Cloud project and enable the Gmail API.
4. Configure OAuth2 credentials and save them as .env in the project directory.
5. Change label and search terms
6. Run the script:
    ```bash
    node main.js
    ```