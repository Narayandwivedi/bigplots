import React from 'react'

const HeroCarousel = () => {
  return (
    <section className="w-full md:w-[70%] lg:w-[46%] mx-auto px-1 sm:px-4 md:px-0">
      <div className="grid grid-cols-2 gap-2 md:gap-5 items-center">
        <img
          src="/banana.png"
          alt="Banana Hero Banner"
          className="w-full lg:w-[90%] h-auto block mx-auto"
        />
        <img
          src="/apple.png"
          alt="Onion Hero Banner"
          className="w-full lg:w-[90%] h-auto block mx-auto"
        />
      </div>
    </section>
  )
}

export default HeroCarousel
