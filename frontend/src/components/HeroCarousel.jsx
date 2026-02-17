import React from 'react'

const HeroCarousel = () => {
  return (
    <section className="w-full lg:w-[92%] mx-auto px-2 sm:px-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 items-center">
        <img
          src="/banana.png"
          alt="Banana Hero Banner"
          className="w-full h-auto block"
        />
        <img
          src="/apple.png"
          alt="Apple Hero Banner"
          className="w-full h-auto block"
        />
        <img
          src="/onion.png"
          alt="Onion Hero Banner"
          className="w-full h-auto block"
        />
        <img
          src="/almond.png"
          alt="Almond Hero Banner"
          className="w-full h-auto block"
        />
      </div>
    </section>
  )
}

export default HeroCarousel
