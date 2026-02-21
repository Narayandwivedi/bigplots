import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LandSortFilters = () => {
  const navigate = useNavigate()
  const [totalCostSort, setTotalCostSort] = useState('')
  const [perAcreSort, setPerAcreSort] = useState('')

  const applySort = (sortKey) => {
    if (!sortKey) return
    navigate(`/search?q=${encodeURIComponent('land')}&sort=${sortKey}`)
  }

  const handleTotalCostChange = (event) => {
    const value = event.target.value
    setTotalCostSort(value)
    setPerAcreSort('')
    applySort(value)
  }

  const handlePerAcreChange = (event) => {
    const value = event.target.value
    setPerAcreSort(value)
    setTotalCostSort('')
    applySort(value)
  }

  return (
    <div className="bg-white border-b border-gray-200 py-2 sm:py-2.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-6xl">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                Total Cost
              </label>
              <select
                value={totalCostSort}
                onChange={handleTotalCostChange}
                className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="">Select order</option>
                <option value="total_cost_desc">Highest to Lowest</option>
                <option value="total_cost_asc">Lowest to Highest</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                Land Value Per Acre
              </label>
              <select
                value={perAcreSort}
                onChange={handlePerAcreChange}
                className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="">Select order</option>
                <option value="per_acre_desc">Highest to Lowest</option>
                <option value="per_acre_asc">Lowest to Highest</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandSortFilters
