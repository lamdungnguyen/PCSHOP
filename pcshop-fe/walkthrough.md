# AI Assistant Backend (Gemini Integrated)

I have updated the backend to use **Google Gemini API** for intelligent PC building recommendations.

## Features
- **Integration**: Connects to Google's `gemini-pro` model.
- **Context-Aware**: Feeds a simplified list of your actual products (top 50) to the AI so it knows what you sell.
- **JSON Output**: Instructs Gemini to return structured JSON data (`reply` + `recommendations`) to power the frontend UI.

## Critical Setup Step

> [!IMPORTANT]
> You **MUST** add your Gemini API Key for this feature to work.

1.  Open `src/main/resources/application.properties`.
2.  Find the line: `gemini.api.key=YOUR_API_KEY_HERE`.
3.  Replace `YOUR_API_KEY_HERE` with your actual Google Gemini API Key. (Get one from [Google AI Studio](https://aistudio.google.com/)).

## How to Verify
1.  **Update Config**: Paste your API Key in `application.properties`.
2.  **Restart Backend**: Stop and restart the Spring Boot application (Maven re-import might be needed due to new dependency).
3.  **Build PC Page**:
    - Go to "Build PC".
    - Ask: "I need a workstation for video editing for 40 million".
    - The AI should think for a moment (calling external API) and then reply with a custom message and pick parts from your database context.

## Troubleshooting
- If the AI says "Sorry, I'm having trouble...", check the backend console logs. It usually means the API Key is missing or invalid, or the quota is exceeded.
