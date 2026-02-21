import React from 'react'
import LocationStrip from '../../components/LocationStrip'
import LandSortFilters from '../../components/LandSortFilters'
import HeroSection from './component/HeroSection'
import TopDealsSection from './component/TopDealsSection'
import ShopByCategorySection from './component/ShopByCategorySection'

const Home = () => {
  return (
    <div>
      <LocationStrip />
      <LandSortFilters />
      <HeroSection />
      {/* <TopDealsSection /> */}
      <ShopByCategorySection />
    </div>
  )
}

export default Home
