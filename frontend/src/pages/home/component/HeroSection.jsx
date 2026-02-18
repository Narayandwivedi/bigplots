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
  const [isMobileDarkened, setIsMobileDarkened] = useState(false);

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
    setIsMobileDarkened(false);
  }, [mobileChunkCount]);

  useEffect(() => {
    if (mobileChunkCount <= 1) return undefined;

    const clearDurationMs = 1500;
    const fadeToDarkDurationMs = 850;
    const darkHoldDurationMs = 120;
    const fadeToClearBufferMs = 700;
    const timeoutIds = new Set();
    let isCancelled = false;

    const schedule = (fn, delay) => {
      const timeoutId = setTimeout(() => {
        timeoutIds.delete(timeoutId);
        if (!isCancelled) {
          fn();
        }
      }, delay);
      timeoutIds.add(timeoutId);
    };

    const runCycle = () => {
      if (isCancelled) return;

      // Start from a clear/normal frame.
      setIsMobileDarkened(false);

      schedule(() => {
        // Slowly dim to dark.
        setIsMobileDarkened(true);

        schedule(() => {
          // Switch while frame is dark.
          setMobileSlideIndex((prev) => (prev + 1) % mobileChunkCount);

          schedule(() => {
            // Reveal the new frame clearly.
            setIsMobileDarkened(false);

            // Keep it clear for a while, then repeat.
            schedule(() => {
              runCycle();
            }, clearDurationMs + fadeToClearBufferMs);
          }, darkHoldDurationMs);
        }, fadeToDarkDurationMs);
      }, clearDurationMs);
    };

    runCycle();

    return () => {
      isCancelled = true;
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutIds.clear();
    };
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
      <div className="relative lg:hidden">
        <div className="grid grid-cols-2 gap-2 md:gap-4 items-center">
          {mobileHeroes.map((hero, index) => renderHeroItem(hero, index + (mobileSlideIndex * mobileChunkSize), 'mobile'))}
        </div>
        <div className={`pointer-events-none absolute inset-0 bg-black transition-opacity duration-[850ms] ease-in-out ${isMobileDarkened ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      <div className="hidden lg:grid lg:grid-cols-4 gap-2 md:gap-4 items-center">
        {displayHeroes.map((hero, index) => renderHeroItem(hero, index, 'desktop'))}
      </div>
    </section>
  );
};

export default HeroSection;
