import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOompas, setSearchTerm } from './listSlice';
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner';

export default function ListView() {
  const dispatch = useDispatch();
  const {
    oompas,
    loading,
    error,
    searchTerm,
    page,
    totalPages,
    lastFetched,
  } = useSelector((state) => state.list);

  const loadMoreRef = useRef(null);

  // Fetch data on mount or if cache expired
  useEffect(() => {
    const oneDay = 24 * 60 * 60 * 1000;
    if (!lastFetched || Date.now() - lastFetched > oneDay) {
      dispatch(fetchOompas(1));
    }
  }, [dispatch, lastFetched]);

  // Infinite scroll observer
  const observer = useRef();

  const loadMore = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page < totalPages && !loading) {
          dispatch(fetchOompas(page + 1));
        }
      });

      if (node) observer.current.observe(node);
    },
    [dispatch, page, totalPages, loading]
  );

  useEffect(() => {
    if (loadMoreRef.current) {
      loadMore(loadMoreRef.current);
    }
  }, [loadMore]);

  // Filter logic
  const filteredOompas = oompas.filter((oompa) => {
    const fullName = `${oompa.first_name} ${oompa.last_name}`.toLowerCase();
    const profession = oompa.profession.toLowerCase();
    const query = searchTerm.toLowerCase();
    return fullName.includes(query) || profession.includes(query);
  });

  return (
    <div className="pt-24 px-4 max-w-screen mx-auto min-h-[calc(100vh-100px)]">
      {/* Search */}
      <div className="flex justify-end mb-6">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search by name or profession"
            className="w-full border rounded pl-10 pr-3 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          />
          <img
            src="https://s3.eu-central-1.amazonaws.com/napptilus/level-test/imgs/ic_search.png"
            alt="Search"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none opacity-60"
          />
        </div>
      </div>

      {/* Headings */}
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
        Find your Oompa Loompa
      </h1>
      <h3 className="text-lg text-center text-gray-400 mb-6">
        There are more than 100k
      </h3>

      {/* Error */}
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {/* Initial loading */}
      {loading && oompas.length === 0 && <Spinner />}

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 min-h-[600px]">
        {filteredOompas.length > 0 ? (
            filteredOompas.map((oompa) => (
            <Link
                key={oompa.id}
                to={`/${oompa.id}`}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition text-center text-white"
            >
                <img
                src={oompa.image}
                alt={`${oompa.first_name} ${oompa.last_name}`}
                className="w-full h-[250px] object-cover rounded mb-4"
                />
                <p className="font-semibold text-lg">
                {oompa.first_name} {oompa.last_name}
                </p>
                <p className="text-sm text-gray-400">
                {oompa.gender === 'M' ? 'Man' : 'Woman'}
                </p>
                <p className="text-sm text-gray-400">{oompa.profession}</p>
            </Link>
            ))
        ) : (
            !loading && (
            <div className="col-span-full flex justify-center items-center py-20">
                <p className="text-center text-gray-500 text-lg">
                    Oops, no Oompa Loompas found.
                </p>
            </div>
            )
        )}
      </div>
      {/* Sentinel for infinite scroll */}
      <div ref={loadMoreRef} className="h-10 mt-6" />
      {/* Scroll loading spinner */}
      {loading && oompas.length > 0 && <Spinner />}
    </div>
  );
}
