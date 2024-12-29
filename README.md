# AI Shorts Video Generator

This is a monorepo project that includes both the [frontend](./frontend/README.md) and [backend](./backend/README.md) for the AI Shorts Video Generator. The application allows users to generate short videos using AI, with features such as video creation, preview, and export. The frontend is built with Next.js, while the backend is built with ASP.NET Core and integrates with various AI services.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [API Endpoints](#api-endpoints)
- [Dependencies](#dependencies)
- [Usage](#usage)

## Features

- **Video Creation**: Users can create short videos by selecting topics, styles, and durations.
- **Video Preview**: After generating a video, users can preview it with generated captions and images.
- **Export Video**: Users can export the generated video once the rendering is completed.
- **Theming**: Supports light and dark themes using `next-themes`.
- **Responsive Design**: Built with Tailwind CSS for responsive and modern UI.
- **Content Generation**: Create video content based on user input using Google's Gemini API.
- **Audio Synthesis**: Convert text input to speech using Google Cloud Text-to-Speech API.
- **Caption Generation**: Generate captions for audio or video files using AssemblyAI.
- **Image Generation**: Generate images from text prompts using Cloudflare's AI API.
- **Video Storage**: Save and retrieve video data, including associated content and captions.

## Requirements

- Node.js (v18.x or above)
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet) or later
- [PostgreSQL](https://www.postgresql.org/download/) for the database
- [Cloudinary](https://cloudinary.com/) account and API key
- [Cloudflare](https://www.cloudflare.com/) account and API key
- [AssemblyAI](https://www.assemblyai.com/) API key

## Installation

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/yourusername/AiShortsVideoGenerator.git
    cd AiShortsVideoGenerator
    ```

2. Install frontend dependencies:

    ```bash
    cd frontend
    npm install
    ```

3. Install backend dependencies:

    ```bash
    cd ../backend
    dotnet restore
    ```

## Environment Variables

Configure the following environment variables for both frontend and backend:

### Frontend (`.env.local`)

```plaintext
NEXT_PUBLIC_API_URL=http://localhost:5211
REMOTION_AWS_SERVE_URL=<Your AWS Serve URL for Remotion>
```

### Backend (appsettings.json)
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "BaseUrl": "http://localhost:5211",
  "GoogleApi": {
    "GeminiKey": "your-gemini-api-key",
    "TextToSpeechKey": "your-text-to-speech-api-key"
  },
  "AssemblyAi": {
    "ApiKey": "your-assemblyai-api-key"
  },
  "CloudinaryUrl": "your-cloudinary-url",
  "Cloudflare": {
    "ApiKey": "your-cloudflare-api-key",
    "AccountId": "your-cloudflare-account-id"
  },
  "ConnectionStrings": {
    "DefaultConnection": "your-postgresql-connection-string"
  }
}
```

## Development

### Frontend
To run the frontend application in development mode:

```bash
cd frontend
npm run dev
```

### Backend
To run the backend application:

```bash
dotnet ef database update
dotnet run
```

## API Endpoints

- **POST /generate-content**: Generate video content from user input using Google's Gemini API.
- **POST /generate-audio**: Convert text input to audio (MP3) using Google Cloud Text-to-Speech API.
- **POST /generate-captions**: Generate captions for an audio or video file using AssemblyAI.
- **POST /generate-image**: Generate an image from a text prompt using Cloudflare's AI API.
- **POST /save-video**: Save a video record to the database.
- **GET /videos/{id}**: Get details of a video by its ID.
- **GET /videos**: Retrieve a list of all videos stored in the database.

## Dependencies

### Frontend

- **Next.js**: React framework for building server-side rendered applications.
- **TailwindCSS**: Utility-first CSS framework for styling the app.
- **Remotion**: Library for creating videos programmatically with React.
- **Axios**: HTTP client for making requests to the API.
- **shadcn**: A collection of re-usable components that you can copy and paste into your apps.

### Backend

- **Google.Cloud.TextToSpeech.V1**: Google Cloud Text-to-Speech client.
- **AssemblyAI**: Client library for AssemblyAI services.
- **CloudinaryDotNet**: Cloudinary SDK for uploading media.
- **Npgsql.EntityFrameworkCore.PostgreSQL**: PostgreSQL support for Entity Framework Core.

## Usage

- **Dashboard**: Users can view and manage generated short videos.
![Image of the dashboard page](./_docs/dashboard.png)
- **Create New Video**: Users can define the video topic, style, and duration, and the app will generate the video content, audio, captions, and images using AI.
![Image of the create new video page](./_docs/create-new.png)
- **Video Preview & Export**: After the video is generated, users can preview it in the dialog and export it once rendered.
![Image of the preview and export video](./_docs/preview-video.png)