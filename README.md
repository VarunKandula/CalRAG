# CalRAG

A Retrieval-Augmented Generation (RAG) application for course discovery and academic advising, built with Next.js, MongoDB, and OpenAI.

## Features

- **Semantic Course Search**: Find courses based on natural language queries
- **AI-Powered Recommendations**: Get personalized course recommendations from an AI advisor
- **Course Information**: Detailed course information including descriptions, prerequisites, and schedules
- **Vector Search**: Utilizes MongoDB Atlas Vector Search for efficient similarity matching
- **Real-time Responses**: Quick and relevant responses using OpenAI's GPT-3.5 Turbo

## Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **Database**: MongoDB Atlas with Vector Search
- **AI/ML**: OpenAI GPT-3.5 Turbo and Ada Embeddings
- **Runtime**: Node.js with TypeScript

## Prerequisites

- Node.js 18+
- MongoDB Atlas M10+ cluster with Vector Search enabled (Reach out to me if you want one)
- OpenAI API key

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/CalRAG.git
cd cal-rag
```

2. Install dependencies:

```bash
npm install
```

3. Initialize the database:

```bash
npm run init-db
```

4. Start the development server:

```bash
npm run dev
```

## MongoDB Atlas Setup

1. Create an M10+ cluster in MongoDB Atlas
2. Create a vector search index on the `course_vectors` collection:

```json
{
  "mappings": {
    "dynamic": true,
    "fields": {
      "embedding": {
        "dimensions": 1536,
        "similarity": "cosine",
        "type": "knnVector"
      }
    }
  }
}
```

## Project Structure

```
cal-rag/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   └── page.tsx           # Main page
├── lib/                   # Core libraries
│   ├── course-service.ts  # Course-related operations
│   ├── mongodb.ts         # MongoDB configuration
│   ├── openai.ts          # OpenAI configuration
│   └── rag-service.ts     # RAG implementation
├── scripts/               # Utility scripts
│   └── init-db.ts        # Database initialization
└── types/                 # TypeScript type definitions
    └── course.ts         # Course-related types
```

## API Routes

- `POST /api/chat`: Main endpoint for course queries and recommendations

## Contributing

I am super open to open source contributions, always looking to make this product better!

Steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
