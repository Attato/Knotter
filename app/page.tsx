import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center gap-2 h-screen">
            <h1 className="text-4xl">Hello, Sequoia!</h1>
            <Link href="/canvas">go to canvas</Link>
        </div>
    );
}
