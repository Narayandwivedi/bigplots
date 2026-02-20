import React, { useEffect, useMemo, useRef, useState } from 'react';

const demoHeroes = [
  {
    _id: 'demo-1',
    imageUrl: '/land1.avif',
    title: 'Land Banner 1',
    linkUrl: '',
    stripText: '5 Acre Land Near Raipur',
  },
  {
    _id: 'demo-2',
    imageUrl: '/land2.jpg',
    title: 'Land Banner 2',
    linkUrl: '',
    stripText: '5 Acre Land Near Raipur',
  },
  {
    _id: 'demo-3',
    imageUrl: '/land3.jpg',
    title: 'Land Banner 3',
    linkUrl: '',
    stripText: '5 Acre Land Near Raipur',
  },
  {
    _id: 'demo-4',
    imageUrl: '/land4.jpg',
    title: 'Land Banner 4',
    linkUrl: '',
    stripText: '25 Acre Land Near Jagdalpur',
  },
  {
    _id: 'demo-5',
    imageUrl: '/land5.jpg',
    title: 'Land Banner 5',
    linkUrl: '',
    stripText: '25 Acre Land Near Jagdalpur',
  },
  {
    _id: 'demo-6',
    imageUrl: '/land7.jpg',
    title: 'Land Banner 6',
    linkUrl: '',
    stripText: '5 Acre Land Near Raipur',
  },
  {
    _id: 'demo-7',
    imageUrl: '/land8.jpg',
    title: 'Land Banner 7',
    linkUrl: '',
    stripText: '25 Acre Land Near Jagdalpur',
  },
];

const MOBILE_VISIBLE_CARDS = 2;
const MOBILE_CLONE_COUNT = MOBILE_VISIBLE_CARDS;
const MOBILE_CARD_WIDTH_PERCENT = 100 / MOBILE_VISIBLE_CARDS;
const MOBILE_SWIPE_THRESHOLD_PX = 22;
const DEFAULT_HERO_TARGET_URL = '/';

const HeroSection = () => {
  const [mobileTrackIndex, setMobileTrackIndex] = useState(MOBILE_CLONE_COUNT);
  const [isMobileTransitionEnabled, setIsMobileTransitionEnabled] = useState(true);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const touchStartXRef = useRef(0);
  const touchCurrentXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchCurrentYRef = useRef(0);
  const didSwipeRef = useRef(false);
  const resumeAutoAfterSwipeRef = useRef(false);

  const displayHeroes = demoHeroes;

  const mobileCloneCount = useMemo(
    () => Math.min(MOBILE_CLONE_COUNT, displayHeroes.length || 1),
    [displayHeroes.length],
  );

  const mobileTrackHeroes = useMemo(() => {
    if (displayHeroes.length === 0) return [];
    if (displayHeroes.length === 1) return displayHeroes;

    const leadingClones = displayHeroes.slice(-mobileCloneCount);
    const trailingClones = displayHeroes.slice(0, mobileCloneCount);
    return [...leadingClones, ...displayHeroes, ...trailingClones];
  }, [displayHeroes, mobileCloneCount]);

  useEffect(() => {
    setMobileTrackIndex(displayHeroes.length > 1 ? mobileCloneCount : 0);
    setIsMobileTransitionEnabled(true);
    setIsAutoPlayPaused(false);
  }, [displayHeroes.length, mobileCloneCount]);

  useEffect(() => {
    if (displayHeroes.length <= 1 || isAutoPlayPaused) return undefined;

    const startTimeoutId = setTimeout(() => {
      setIsMobileTransitionEnabled(true);
      setMobileTrackIndex((prev) => prev + 1);
    }, 60);

    return () => {
      clearTimeout(startTimeoutId);
    };
  }, [displayHeroes.length, isAutoPlayPaused]);

  const handleMobileTransitionEnd = () => {
    if (displayHeroes.length <= 1) return;

    const maxTrackStartIndex = mobileCloneCount + displayHeroes.length;
    const shouldResumeAfterSwipe = resumeAutoAfterSwipeRef.current;

    if (mobileTrackIndex >= maxTrackStartIndex) {
      setIsMobileTransitionEnabled(false);
      setMobileTrackIndex((prev) => prev - displayHeroes.length);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsMobileTransitionEnabled(true);
          if (shouldResumeAfterSwipe) {
            resumeAutoAfterSwipeRef.current = false;
            setIsAutoPlayPaused(false);
            return;
          }
          if (!isAutoPlayPaused) {
            setMobileTrackIndex((prev) => prev + 1);
          }
        });
      });
      return;
    }

    if (mobileTrackIndex < mobileCloneCount) {
      setIsMobileTransitionEnabled(false);
      setMobileTrackIndex((prev) => prev + displayHeroes.length);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsMobileTransitionEnabled(true);
          if (shouldResumeAfterSwipe) {
            resumeAutoAfterSwipeRef.current = false;
            setIsAutoPlayPaused(false);
            return;
          }
          if (!isAutoPlayPaused) {
            setMobileTrackIndex((prev) => prev + 1);
          }
        });
      });
      return;
    }

    if (shouldResumeAfterSwipe) {
      resumeAutoAfterSwipeRef.current = false;
      setIsAutoPlayPaused(false);
      return;
    }

    if (!isAutoPlayPaused) {
      setMobileTrackIndex((prev) => prev + 1);
    }
  };

  const handleMobileTouchStart = (event) => {
    if (displayHeroes.length <= 1) return;

    const touchX = event.touches[0]?.clientX ?? 0;
    const touchY = event.touches[0]?.clientY ?? 0;
    touchStartXRef.current = touchX;
    touchCurrentXRef.current = touchX;
    touchStartYRef.current = touchY;
    touchCurrentYRef.current = touchY;
    didSwipeRef.current = false;
    resumeAutoAfterSwipeRef.current = false;
    setIsAutoPlayPaused(true);
  };

  const handleMobileTouchMove = (event) => {
    if (displayHeroes.length <= 1) return;
    touchCurrentXRef.current = event.touches[0]?.clientX ?? touchCurrentXRef.current;
    touchCurrentYRef.current = event.touches[0]?.clientY ?? touchCurrentYRef.current;

    const deltaX = Math.abs(touchCurrentXRef.current - touchStartXRef.current);
    const deltaY = Math.abs(touchCurrentYRef.current - touchStartYRef.current);
    if (deltaX > deltaY && deltaX > 6) {
      event.preventDefault();
    }
  };

  const handleMobileTouchEnd = () => {
    if (displayHeroes.length <= 1) return;

    const deltaX = touchStartXRef.current - touchCurrentXRef.current;
    const deltaY = touchStartYRef.current - touchCurrentYRef.current;
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

    if (isHorizontalSwipe && Math.abs(deltaX) >= MOBILE_SWIPE_THRESHOLD_PX) {
      didSwipeRef.current = true;
      resumeAutoAfterSwipeRef.current = true;
      setIsMobileTransitionEnabled(true);
      setMobileTrackIndex((prev) => (deltaX > 0 ? prev + 1 : prev - 1));
    } else {
      setIsAutoPlayPaused(false);
    }

    touchStartXRef.current = 0;
    touchCurrentXRef.current = 0;
    touchStartYRef.current = 0;
    touchCurrentYRef.current = 0;
    setTimeout(() => {
      didSwipeRef.current = false;
    }, 300);
  };

  const handleMobileTouchCancel = () => {
    setIsAutoPlayPaused(false);
    resumeAutoAfterSwipeRef.current = false;
    touchStartXRef.current = 0;
    touchCurrentXRef.current = 0;
    touchStartYRef.current = 0;
    touchCurrentYRef.current = 0;
  };

  const renderHeroItem = (hero, index, keyPrefix = 'hero') => {
    const imageSrc = hero.imageUrl;
    const altText = hero.title || `Hero banner ${index + 1}`;
    const stripText = String(hero.stripText || '').trim() || 'Land for Sale';
    const destinationUrl = String(hero.linkUrl || '').trim() || DEFAULT_HERO_TARGET_URL;
    const isExternal = /^https?:\/\//i.test(destinationUrl);

    const imageNode = (
      <div className="relative overflow-hidden rounded-md">
        <img
          src={imageSrc}
          alt={altText}
          className="w-full h-auto block"
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          onContextMenu={(event) => event.preventDefault()}
          style={{
            userSelect: 'none',
            WebkitUserDrag: 'none',
            WebkitTouchCallout: 'none',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-r from-black/75 via-slate-900/70 to-black/75 px-2 py-1 sm:px-3 sm:py-1.5">
          <span className="block truncate text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wide text-white text-center">
            {stripText}
          </span>
        </div>
      </div>
    );

    return (
      <a
        key={`${keyPrefix}-${hero._id || imageSrc}-${index}`}
        href={destinationUrl}
        target={isExternal ? '_blank' : '_self'}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        onClick={(event) => {
          if (didSwipeRef.current) {
            event.preventDefault();
          }
        }}
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
        style={{
          userSelect: 'none',
          WebkitTouchCallout: 'none',
        }}
      >
        {imageNode}
      </a>
    );
  };

  return (
    <section className="w-full lg:w-[92%] mx-auto px-1 sm:px-4">
      <div className="relative overflow-hidden lg:hidden">
        <div
          className={`${isMobileTransitionEnabled ? 'transition-transform duration-[900ms] ease-linear' : 'transition-none'} flex select-none`}
          style={{
            transform: `translateX(-${mobileTrackIndex * MOBILE_CARD_WIDTH_PERCENT}%)`,
            touchAction: 'pan-y',
          }}
          onTransitionEnd={handleMobileTransitionEnd}
          onTouchStart={handleMobileTouchStart}
          onTouchMove={handleMobileTouchMove}
          onTouchEnd={handleMobileTouchEnd}
          onTouchCancel={handleMobileTouchCancel}
          onContextMenu={(event) => event.preventDefault()}
        >
          {mobileTrackHeroes.map((hero, index) => (
            <div
              key={`mobile-hero-${hero._id || index}-${index}`}
              className="shrink-0 px-0.5"
              style={{ width: `${MOBILE_CARD_WIDTH_PERCENT}%` }}
            >
              {renderHeroItem(hero, index, `mobile-${index}`)}
            </div>
          ))}
        </div>
      </div>

      <div className="hidden lg:grid lg:grid-cols-5 gap-2 md:gap-4 items-center">
        {displayHeroes.map((hero, index) => renderHeroItem(hero, index, 'desktop'))}
      </div>
    </section>
  );
};

export default HeroSection;
