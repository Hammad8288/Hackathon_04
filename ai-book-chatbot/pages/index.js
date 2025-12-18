import Chat from '../components/Chat';
import Head from 'next/head';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>AI Book Chatbot</title>
        <meta name="description" content="Chat with a book using AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container">
        <h1 className="title">AI Book Chatbot</h1>
        <p className="description">
          Ask any question about the book, and the AI will answer based on the content.
        </p>
        <Chat />
      </main>
    </>
  );
}
