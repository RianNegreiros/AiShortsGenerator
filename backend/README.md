AiShortsGenerator Backend
=========================

Table of Contents
-----------------

-   [Project Overview](#project-overview)
-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Clone the Repository](#clone-the-repository)
    -   [Configuration](#configuration)
    -   [Database Setup](#database-setup)
    -   [Run the Application](#run-the-application)
-   [API Documentation](#api-documentation)
    -   [POST /generate-content](#post-generate-content)
    -   [POST /generate-audio](#post-generate-audio)
    -   [POST /generate-captions](#post-generate-captions)
    -   [POST /generate-image](#post-generate-image)
    -   [POST /save-video](#post-save-video)
    -   [GET /videos/{id}](#get-videosid)
    -   [GET /videos](#get-videos)
-   [Database Schema](#database-schema)

Project Overview
----------------

AiShortsGenerator is an API designed to provide content generation for videos, audio, captions, and images. The backend is integrated with AI tools and services for generating content.

This API uses:

-   **Gemini API** for generating video content.
-   **Google Text-to-Speech API** for synthesizing text-to-speech audio.
-   **AssemblyAI** for generating captions for audio/video files.
-   **Cloudflare Workers AI** for generating images from text prompts.
-   **Cloudinary** for storing and serving media files.

The API is built on **ASP.NET Core** and **PostgreSQL** for data persistence.

## Features

- **Content Generation**: Create video content based on user input using Google's Gemini API.
- **Audio Synthesis**: Convert text input to speech using Google Cloud Text-to-Speech API.
- **Caption Generation**: Generate captions for audio or video files using AssemblyAI.
- **Image Generation**: Generate images from text prompts using Cloudflare's Workers AI API.
- **Video Storage**: Save and retrieve video data, including associated content and captions.

Tech Stack
----------

-   **Backend Framework**: ASP.NET Core 7
-   **Database**: PostgreSQL
-   **AI Services**:
    -   Google Gemini API
    -   Google Cloud Text-to-Speech
    -   AssemblyAI
    -   Cloudflare API
-   **Cloud Storage**: Cloudinary
-   **ORM**: Entity Framework Core

## Getting Started

### Prerequisites

Ensure you have the following set up:

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet).
- [PostgreSQL](https://www.postgresql.org/download/) for the database. I used [Neon Serverless Postgres](https://neon.tech/)
- [Text-to-Speech AI](https://cloud.google.com/text-to-speech) API key.
- [Cloudinary](https://cloudinary.com/) account and API key.
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) account and API key. I used [flux-1-schnell Model](https://developers.cloudflare.com/workers-ai/models/flux-1-schnell/)
- [AssemblyAI](https://www.assemblyai.com/) API key.

### Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/RianNegreiros/AiShortsVideosGenerator.git
    cd AiShortsGenerator/backend
    ```

2. Install dependencies:

    ```bash
    dotnet restore
    ```

3. Configure your settings: Create a `appsettings.Development.json` file and configure the following settings:

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

4. Create the database:

    ```bash
    dotnet ef database update
    ```

5. Run the application:

    ```bash
    dotnet run
    ```

   The backend will be accessible at [http://localhost:5211](http://localhost:5211).

### API Endpoints

1. **POST /generate-content**

    - Description: Generate video content from user input using Google's Gemini API.
    - Request Body:

      ```json
      {
        "input": "Your text input for content generation."
      }
      ```

    - Response: List of generated video content items.
    - Example:

      ```json
      [
        {
          "id": 1,
          "content": "Generated content",
          "otherProperty": "value"
        }
      ]
      ```

2. **POST /generate-audio**

    - Description: Convert text input to audio (MP3) using Google Cloud Text-to-Speech API.
    - Request Body:

      ```json
      {
        "input": "Text to convert to speech."
      }
      ```

    - Response: URL of the uploaded audio file.
    - Example:

      ```json
      {
        "url": "https://your-cloudinary-url.com/audio.mp3"
      }
      ```

3. **POST /generate-captions**

    - Description: Generate captions for an audio or video file using AssemblyAI.
    - Request Body:

      ```json
      {
        "fileUrl": "URL of the audio/video file."
      }
      ```

    - Response: Transcription and captions in JSON format.

4. **POST /generate-image**

    - Description: Generate an image from a text prompt using Cloudflare's AI API.
    - Request Body:

      ```json
      {
        "Prompt": "Text prompt for image generation."
      }
      ```

    - Response: URL of the uploaded image.
    - Example:

      ```json
      {
        "url": "https://your-cloudinary-url.com/image.jpg"
      }
      ```

5. **POST /save-video**

    - Description: Save a video record to the database.
    - Request Body:

      ```json
      {
        "VideoContent": "Generated video content",
        "Captions": "Generated captions"
      }
      ```

    - Response: Success message with video ID.

6. **GET /videos/{id}**

    - Description: Get details of a video by its ID.
    - Response: Video details in JSON format.

7. **GET /videos**

    - Description: Retrieve a list of all videos stored in the database.
    - Response: List of videos.

## Database Structure

The database uses PostgreSQL with a Videos table. Each video contains:

- **VideoContent**: Video content in JSON format.
- **AudioFileUrl**: Audio file URL in string format.
- **Captions**: Captions in JSON format.
- **Images**: Images in an array of strings format.

## Dependencies

- `Google.Cloud.TextToSpeech.V1`: Google Cloud Text-to-Speech client.
- `AssemblyAI:` Client library for AssemblyAI services.
- `CloudinaryDotNet`: Cloudinary SDK for uploading media.
- `Npgsql.EntityFrameworkCore.PostgreSQL`: PostgreSQL support for Entity Framework Core.