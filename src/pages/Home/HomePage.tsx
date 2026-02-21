import React, { useEffect, useState } from 'react';
import type { HomePageViewModel } from '../../types/home';
import '../../styles/home-style.css';
import { fetchHomePage } from '../../api/homeApi';

const HomePage: React.FC = () => {
  const [data, setData] = useState<HomePageViewModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomePage()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) return <div className="home-root">Loading...</div>;
  if (!data) return <div className="home-root">Failed to load home page.</div>;

  return (
    <div className="home-root">
      <div className="home-content">
        {data.imageUrl && (
          <img className="home-image" src={data.imageUrl} alt={data.title || 'Concert'} />
        )}
        <h1 className="home-title">{data.title}</h1>
        {data.subtitle && <h2 className="home-subtitle">{data.subtitle}</h2>}
        {data.description && <p className="home-description">{data.description}</p>}
        {data.buttonText && data.buttonUrl && (
          <a className="home-button" href={data.buttonUrl}>{data.buttonText}</a>
        )}

        {data.concert && (
          <div className="concert-info">
            <h3>Concert Info</h3>
            <p><strong>Title:</strong> {data.concert.title}</p>
            <p><strong>City:</strong> {data.concert.city}</p>
            <p><strong>Venue:</strong> {data.concert.venue}</p>
            <p><strong>Address:</strong> {data.concert.address}</p>
            {data.concert.dates && (
              <p>
                <strong>Dates:</strong> {data.concert.dates.map(date => new Date(date).toLocaleDateString()).join(', ')}
              </p>
            )}
            {data.concert.additionalInfo && (
              <p><strong>Info:</strong> {data.concert.additionalInfo}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;