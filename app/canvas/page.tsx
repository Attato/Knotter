import Link from 'next/link';

export default function Canvas() {
	return (
		<div className="flex flex-col items-center justify-center gap-2 h-screen">
			<Link href="/">go to home</Link>

			<canvas className="border border-white"></canvas>
		</div>
	);
}
