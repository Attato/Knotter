import Link from 'next/link';

export default function Canvas() {
	return (
		<div className="flex flex-col items-center justify-center gap-2 h-screen">
			<Link href="/" className="absolute top-4 left-4">
				go to home
			</Link>

			<canvas className="w-full h-full"></canvas>
		</div>
	);
}
