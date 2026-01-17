'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { useDebounce } from '@/hooks/useDebounce';

const Search = ({ placeholder }: { placeholder: string }) => {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, 500);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [debouncedSearch, router]);
  return (
    <div className="w-1/2 relative flex items-center shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        id="search"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full outline-0 border-secondary focus:border-b-2  focus:bg-light focus:text-dark pl-10 rounded-lg transition-all duration-300 ease-in-out"
        placeholder={placeholder}
      />
      <FaMagnifyingGlass className="absolute left-3 top-1/2  -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
};

export default Search;
