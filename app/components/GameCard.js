import Link from 'next/link';

export default function GameCard({ img }) {
  const slug = img.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <Link href={`../games/${slug}`} className="flex justify-center items-center max-w-sm m-10">
      <div className="bg-purple-600 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer w-full max-w-sm p-4 flex flex-col items-center text-center">
        <img src={img.src} alt={img.name} className="w-40 object-contain mb-4" />
        <h1 className="text-white lg:text-4xl text-3xl font-semibold mb-2">{img.name}</h1>
        <p className="text-white lg:text-2xl text-2xl">{img.desc}</p>
      </div>
    </Link>
  );
}