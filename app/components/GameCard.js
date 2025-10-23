import Link from 'next/link';

export default function GameCard({ img }) {
  const slug = img.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <Link href={`../games/${slug}`} className="flex justify-center items-center max-w-sm m-10">
      <div className="bg-purple-600 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer w-full max-w-sm p-4 flex flex-col items-center text-center">
        <img src={img.src} alt={img.name} className="w-32 h-32 object-contain mb-4" />
        <h2 className="text-white text-xl font-semibold mb-2">{img.name}</h2>
        <p className="text-white text-sm">{img.desc}</p>
      </div>
    </Link>
  );
}