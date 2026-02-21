import React, { useState } from 'react'
import { LocateFixed } from 'lucide-react'

const stateDistrictOptions = {
  Chhattisgarh: [
    'Raipur',
    'Jagdalpur',
    'Bilaspur',
    'Durg',
    'Bhilai',
    'Rajnandgaon',
    'Korba',
    'Ambikapur',
  ],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
  Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  Jharkhand: ['Ranchi', 'Jamshedpur', 'Dhanbad'],
  Telangana: ['Hyderabad', 'Warangal', 'Nizamabad'],
  Karnataka: ['Bengaluru', 'Mysuru', 'Hubli'],
  Delhi: ['Central Delhi', 'North Delhi', 'South Delhi'],
}

const LocationStrip = () => {
  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [showLocationPopup, setShowLocationPopup] = useState(false)
  const stateOptions = Object.keys(stateDistrictOptions)
  const districtOptions = selectedState ? stateDistrictOptions[selectedState] || [] : []

  const openLocationPopup = () => {
    setShowLocationPopup(true)
  }

  const closeLocationPopup = () => {
    setShowLocationPopup(false)
  }

  const handleStateChange = (event) => {
    setSelectedState(event.target.value)
    setSelectedDistrict('')
  }

  const handleDistrictChange = (event) => {
    const district = event.target.value
    setSelectedDistrict(district)
    if (selectedState && district) {
      setShowLocationPopup(false)
    }
  }

  const handleUseCurrentLocation = () => {
    setShowLocationPopup(false)
  }

  const locationLabel =
    selectedState && selectedDistrict
      ? `${selectedDistrict}, ${selectedState}`
      : 'Select location'

  return (
    <div className="bg-white border-b border-gray-200 py-2 sm:py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-6xl">
          <button
            type="button"
            onClick={openLocationPopup}
            className="h-8 sm:h-9 w-full sm:w-[320px] flex items-center rounded-lg border border-sky-200 bg-gradient-to-r from-sky-50 to-blue-100 px-3 text-left hover:border-sky-300 transition-colors"
            aria-label="Select location"
            title="Choose location"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 text-slate-900 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 8.05a5 5 0 119.9 0c0 3.808-5 9.95-5 9.95s-5-6.142-5-9.95zM10 10a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-2 text-xs sm:text-[13px] font-semibold text-gray-900 truncate">
              {locationLabel}
            </span>
          </button>
        </div>
      </div>

      {showLocationPopup && (
        <div
          className="fixed inset-0 z-50 bg-black/45 px-4 flex items-center justify-center"
          onClick={closeLocationPopup}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-4 sm:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Choose Location
              </h3>
              <button
                type="button"
                onClick={closeLocationPopup}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close location popup"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <p className="mb-1.5 text-xs font-semibold text-gray-700">Choose State</p>
                <select
                  value={selectedState}
                  onChange={handleStateChange}
                  className="w-full px-2 sm:px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-xs sm:text-sm bg-white text-gray-900"
                >
                  <option value="">Select state</option>
                  {stateOptions.map((stateName) => (
                    <option key={stateName} value={stateName}>
                      {stateName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-1.5 text-xs font-semibold text-gray-700">Choose District</p>
                <select
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  disabled={!selectedState}
                  className="w-full px-2 sm:px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-xs sm:text-sm bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">{selectedState ? 'Select district' : 'Select state first'}</option>
                  {districtOptions.map((districtName) => (
                    <option key={districtName} value={districtName}>
                      {districtName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="mt-3 w-full rounded-lg border border-sky-300 bg-sky-50 px-3 py-2.5 text-sm font-semibold text-sky-900 hover:bg-sky-100 transition-colors flex items-center justify-center gap-2"
            >
              <LocateFixed className="h-4 w-4" />
              Use my current location
            </button>
            <p className="mt-1.5 text-center text-xs text-gray-500">
              Allow access to location
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default LocationStrip
