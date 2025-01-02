# Frontend Project

This project is a frontend for generating short videos using AI. It allows users to create new videos, preview them, and export them. The application uses `Next.js`, `TailwindCSS`, `shadcn`, `remotion`, `Axios`, and integrates with an API for content generation and video rendering.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Dependencies](#dependencies)
- [Usage](#usage)

## Features

- **Video Creation**: Users can input a topic, select an image style, and define the duration for their video.
- **Video Preview**: After generating a video, users can preview the video with generated captions and images.
- **Video Deletion**: After generating a video, users can delete the video from the database and the cloud.
- **Export Video**: Users can export the generated video once the rendering is completed.
- **Dark/Light Theme**: The application supports dark and light modes.

## Requirements

- Node.js (v22)
- API for video generation (Ensure your environment variables are correctly configured on backend/appsettings.Development.json)

## Installation

1. Clone the repository to your local machine:

```bash
 git clone https://github.com/RianNegreiros/AiShortsVideosGenerator.git
 cd frontend
```

2. Install dependencies:

```bash
npm install
```

## Environment Variables

Before starting the app, make sure you configure the following environment variables in your `.env` file:

```plaintext
  NEXT_PUBLIC_API_URL=<Your API URL>
  REMOTION_AWS_SERVE_URL=<Your AWS Serve URL for Remotion>
  REMOTION_AWS_BUCKET_NAME=<Your AWS Bucket URL for Remotion>
```

To get the AWS Serve URL and Bucket follow this [guide](https://www.remotion.dev/docs/lambda/setup) from the remotion docs

## Development

To run the application in development mode, use the following command:

```bash
npm run dev
```

This will start the app on http://localhost:3000 by default. You can modify the port by setting the PORT environment variable.

## Building for Production

To build the application for production, use the following command:

```bash
npm run build
npm run start
```

## Dependencies

- **Next.js**: React framework for building server-side rendered applications.
- **TailwindCSS**: Utility-first CSS framework for styling the app.
- **Remotion**: Library for creating videos programmatically with React.
- **Axios**: HTTP client for making requests to the API.
- **shadcn**: A collection of re-usable components that you can copy and paste into your apps.

## Usage

1. **Dashboard**: Users can view and manage generated short videos.
2. **Create New Video**: Users can define the video topic, style, and duration, and the app will generate the video content, audio, captions, and images using AI.
3. **Video Preview, Export & Delete**: After the video is generated, users can preview it in the dialog and export it once rendered or deleted it.
