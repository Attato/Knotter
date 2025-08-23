import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center gap-2 h-screen">
            <Link href="/canvas" className="text-6xl font-extrabold">
                В РАЗРАБОТКЕ...
            </Link>
        </div>
    );
}
