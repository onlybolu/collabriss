import NextImage from 'next/image';

export default function Loader({ message }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-[#2EBF83]"></div>
      <div className="mt-4">
        <NextImage src="/logo.png" alt="Collabriss Logo" width={1000} height={28} className="h-50 w-auto" priority />
      </div>
      {message && <p className="text-slate-500 mt-2 text-sm">{message}</p>}
    </div>
  );
}