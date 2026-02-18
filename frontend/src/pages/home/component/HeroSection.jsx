import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../../context/AppContext';

const demoHeroes = [
  { _id: 'demo-1', imageUrl: '/banana.png', title: 'Banana Banner', linkUrl: '' },
  { _id: 'demo-2', imageUrl: '/apple.png', title: 'Apple Banner', linkUrl: '' },
  { _id: 'demo-3', imageUrl: '/onion.png', title: 'Onion Banner', linkUrl: '' },
  { _id: 'demo-4', imageUrl: '/almond.png', title: 'Almond Banner', linkUrl: '' }
];

const resolveHeroImageUrl = (backendUrl, imageUrl) => {
  if (!imageUrl) return '';
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith('/uploads')) {
    return `${backendUrl}${imageUrl}`;
  }
  return imageUrl;
};

const HeroSection = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [heroes, setHeroes] = useState([]);
  const [mobileSlideIndex, setMobileSlideIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchHeroes = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/heroes?limit=4`);
        const heroList = Array.isArray(response.data?.data) ? response.data.data : [];

        if (isMounted) {
          setHeroes(heroList.slice(0, 4));
        }
      } catch (error) {
        if (isMounted) {
          setHeroes([]);
        }
      }
    };

    fetchHeroes();

    return () => {
      isMounted = false;
    };
  }, [BACKEND_URL]);

  const displayHeroes = useMemo(() => {
    if (heroes.length > 0) return heroes;
    return demoHeroes;
  }, [heroes]);

  const mobileChunkSize = 2;
  const mobileChunkCount = useMemo(() => {
    return Math.max(1, Math.ceil(displayHeroes.length / mobileChunkSize));
  }, [displayHeroes.length]);

  useEffect(() => {
    setMobileSlideIndex(0);
  }, [mobileChunkCount]);

  useEffect(() => {
    if (mobileChunkCount <= 1) return undefined;

    const intervalId = setInterval(() => {
      setMobileSlideIndex((prev) => (prev + 1) % mobileChunkCount);
    }, 2200);

    return () => clearInterval(intervalId);
  }, [mobileChunkCount]);

  const mobileHeroes = useMemo(() => {
    const start = mobileSlideIndex * mobileChunkSize;
    return displayHeroes.slice(start, start + mobileChunkSize);
  }, [displayHeroes, mobileSlideIndex]);

  const renderHeroItem = (hero, index, keyPrefix = 'hero') => {
    const imageSrc = resolveHeroImageUrl(BACKEND_URL, hero.imageUrl);
    const altText = hero.title || `Hero banner ${index + 1}`;
    const hasLink = Boolean(hero.linkUrl);
    const isExternal = /^https?:\/\//i.test(hero.linkUrl || '');

    const imageNode = (
      <img
        src={imageSrc}
        alt={altText}
        className="w-full h-auto block rounded-md"
      />
    );

    if (!hasLink) {
      return (
        <div key={`${keyPrefix}-${hero._id || imageSrc}-${index}`}>
          {imageNode}
        </div>
      );
    }

    return (
      <a
        key={`${keyPrefix}-${hero._id || imageSrc}-${index}`}
        href={hero.linkUrl}
        target={isExternal ? '_blank' : '_self'}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {imageNode}
      </a>
    );
  };

  return (
    <section className="w-full lg:w-[92%] mx-auto px-2 sm:px-4">
      <div className="grid grid-cols-2 gap-2 md:gap-4 items-center lg:hidden">
        {mobileHeroes.map((hero, index) => renderHeroItem(hero, index + (mobileSlideIndex * mobileChunkSize), 'mobile'))}
      </div>

      <div className="hidden lg:grid lg:grid-cols-4 gap-2 md:gap-4 items-center">
        {displayHeroes.map((hero, index) => renderHeroItem(hero, index, 'desktop'))}
      </div>
    </section>
  );
};

export default HeroSection;
