import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchDetail } from './detailSlice';

export default function DetailView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const parsedId = parseInt(id);

  const entity = useSelector((state) => state.detail.entities[parsedId]);
  const status = useSelector((state) => state.detail.status);
  const error = useSelector((state) => state.detail.error);

  useEffect(() => {
    const oneDay = 24 * 60 * 60 * 1000;
    const now = Date.now();

    const shouldFetch =
      !entity || !entity.lastFetched || now - entity.lastFetched > oneDay;

    if (shouldFetch) {
      dispatch(fetchDetail(parsedId));
    }
  }, [dispatch, parsedId, entity]);

  if ('loading' === status && !entity) {
    return <p className="text-center text-lg">Loading details...</p>;
  }

  if ('failed' === status) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!entity?.data) return null;

  const data = entity.data;

  return (
    <div className="w-full px-4">
      <div className="max-w-screen p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={data.image}
            alt={`${data.first_name} ${data.last_name}`}
            className="w-64 h-64 object-cover rounded-lg"
          />
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {data.first_name} {data.last_name}
            </h2>
            <p className="text-gray-600 mb-1 italic">{data.gender === 'M' ? 'Man' : 'Woman'}</p>
            <p className="text-gray-600 mb-4">{data.profession}</p>
            <div
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
