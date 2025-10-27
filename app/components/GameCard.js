import Link from 'next/link';

export default function GameCard({ img }) {
  const slug = img.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <Link href={`../games/${slug}`} className="flex justify-center items-center max-w-sm m-10">
      <div className="bg-purple-600 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer w-full max-w-sm p-4 flex flex-col items-center text-center">
        <img src={img.src} alt={img.name} className="w-80 h-60 object-contain mb-4" />
        <h1 className="text-white text-5xl font-semibold mb-2">{img.name}</h1>
        <p className="text-white text-3xl">{img.desc}</p>
      </div>
    </Link>
  );
}