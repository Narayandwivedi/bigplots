export const SPECIFICATION_TEMPLATES = {
  'graphics-card': [
    { key: 'Memory', label: 'Memory', required: true, placeholder: 'e.g., 16GB GDDR6X' },
    { key: 'Memory Interface', label: 'Memory Interface', required: false, placeholder: 'e.g., 256-bit' },
    { key: 'Base Clock', label: 'Base Clock', required: false, placeholder: 'e.g., 2205 MHz' },
    { key: 'Boost Clock', label: 'Boost Clock', required: false, placeholder: 'e.g., 2505 MHz' },
    { key: 'CUDA Cores', label: 'CUDA Cores', required: false, placeholder: 'e.g., 9728' },
    { key: 'RT Cores', label: 'Ray Tracing Cores', required: false, placeholder: 'e.g., 76 (3rd gen)' },
    { key: 'Tensor Cores', label: 'Tensor Cores', required: false, placeholder: 'e.g., 304 (4th gen)' },
    { key: 'Memory Speed', label: 'Memory Speed', required: false, placeholder: 'e.g., 22.4 Gbps' },
    { key: 'Memory Bandwidth', label: 'Memory Bandwidth', required: false, placeholder: 'e.g., 716.8 GB/sec' },
    { key: 'Bus Interface', label: 'Bus Interface', required: false, placeholder: 'e.g., PCI-E 4.0 x16' },
    { key: 'Display Support', label: 'Display Support', required: false, placeholder: 'e.g., 4x DisplayPort 1.4a, 1x HDMI 2.1' },
    { key: 'Max Resolution', label: 'Max Resolution', required: false, placeholder: 'e.g., 7680x4320@60Hz' },
    { key: 'Power Consumption', label: 'Power Consumption', required: false, placeholder: 'e.g., 320W' },
    { key: 'Recommended PSU', label: 'Recommended PSU', required: false, placeholder: 'e.g., 750W' },
    { key: 'Power Connectors', label: 'Power Connectors', required: false, placeholder: 'e.g., 3x 8-pin PCIe' }
  ],
  
  'processors': [
    { key: 'Cores', label: 'Cores', required: true, placeholder: 'e.g., 16 (8P + 8E)' },
    { key: 'Threads', label: 'Threads', required: true, placeholder: 'e.g., 24' },
    { key: 'Base Clock P-Core', label: 'Base Clock P-Core', required: false, placeholder: 'e.g., 3.4 GHz' },
    { key: 'Max Boost Clock', label: 'Max Boost Clock', required: false, placeholder: 'e.g., 5.4 GHz' },
    { key: 'Cache', label: 'Cache', required: false, placeholder: 'e.g., 30MB Intel Smart Cache' },
    { key: 'Socket', label: 'Socket', required: true, placeholder: 'e.g., LGA1700' },
    { key: 'Process', label: 'Process', required: false, placeholder: 'e.g., Intel 7 (10nm)' },
    { key: 'Memory Support', label: 'Memory Support', required: false, placeholder: 'e.g., DDR4-3200, DDR5-5600' },
    { key: 'Max Memory', label: 'Max Memory', required: false, placeholder: 'e.g., 128GB' },
    { key: 'TDP', label: 'TDP', required: false, placeholder: 'e.g., 125W' },
    { key: 'Max Turbo Power', label: 'Max Turbo Power', required: false, placeholder: 'e.g., 253W' },
    { key: 'Graphics', label: 'Integrated Graphics', required: false, placeholder: 'e.g., Intel UHD Graphics 770' },
    { key: 'PCIe Lanes', label: 'PCIe Lanes', required: false, placeholder: 'e.g., 20 (PCIe 4.0 & 5.0)' }
  ],
  
  'memory': [
    { key: 'Capacity', label: 'Capacity', required: true, placeholder: 'e.g., 16GB (2x8GB)' },
    { key: 'Memory Type', label: 'Memory Type', required: true, placeholder: 'e.g., DDR4' },
    { key: 'Speed', label: 'Speed', required: true, placeholder: 'e.g., 3200 MHz' },
    { key: 'Timings', label: 'Timings', required: false, placeholder: 'e.g., CL16-18-18-36' },
    { key: 'Voltage', label: 'Voltage', required: false, placeholder: 'e.g., 1.35V' },
    { key: 'Form Factor', label: 'Form Factor', required: false, placeholder: 'e.g., DIMM 288-pin' },
    { key: 'Heat Spreader', label: 'Heat Spreader', required: false, placeholder: 'e.g., Aluminum' },
    { key: 'Profile', label: 'Profile', required: false, placeholder: 'e.g., XMP 2.0' },
    { key: 'Compatibility', label: 'Compatibility', required: false, placeholder: 'e.g., Intel/AMD' }
  ],
  
  'storage': [
    { key: 'Capacity', label: 'Capacity', required: true, placeholder: 'e.g., 1TB' },
    { key: 'Form Factor', label: 'Form Factor', required: true, placeholder: 'e.g., M.2 2280' },
    { key: 'Interface', label: 'Interface', required: true, placeholder: 'e.g., NVMe PCIe 4.0' },
    { key: 'Sequential Read', label: 'Sequential Read', required: false, placeholder: 'e.g., 7,000 MB/s' },
    { key: 'Sequential Write', label: 'Sequential Write', required: false, placeholder: 'e.g., 6,300 MB/s' },
    { key: 'Random Read', label: 'Random Read', required: false, placeholder: 'e.g., 1,000K IOPS' },
    { key: 'Random Write', label: 'Random Write', required: false, placeholder: 'e.g., 1,200K IOPS' },
    { key: 'TBW', label: 'TBW (Endurance)', required: false, placeholder: 'e.g., 600 TBW' },
    { key: 'NAND Type', label: 'NAND Type', required: false, placeholder: 'e.g., 3D TLC NAND' },
    { key: 'Controller', label: 'Controller', required: false, placeholder: 'e.g., Phison E18' }
  ],
  
  'motherboards': [
    { key: 'Socket', label: 'Socket', required: true, placeholder: 'e.g., LGA1700' },
    { key: 'Chipset', label: 'Chipset', required: true, placeholder: 'e.g., Z790' },
    { key: 'Form Factor', label: 'Form Factor', required: false, placeholder: 'e.g., ATX' },
    { key: 'Memory Support', label: 'Memory Support', required: false, placeholder: 'e.g., DDR5-5600' },
    { key: 'Memory Slots', label: 'Memory Slots', required: false, placeholder: 'e.g., 4x DIMM' },
    { key: 'Max Memory', label: 'Max Memory', required: false, placeholder: 'e.g., 128GB' },
    { key: 'PCIe Slots', label: 'PCIe Slots', required: false, placeholder: 'e.g., 3x PCIe 5.0 x16, 2x PCIe 4.0 x1' },
    { key: 'Storage', label: 'Storage', required: false, placeholder: 'e.g., 4x M.2, 6x SATA' },
    { key: 'Rear IO', label: 'Rear I/O', required: false, placeholder: 'e.g., USB-C, USB 3.2, Ethernet, Audio' },
    { key: 'Network', label: 'Network', required: false, placeholder: 'e.g., 2.5G Ethernet, Wi-Fi 6E' },
    { key: 'Audio', label: 'Audio', required: false, placeholder: 'e.g., 7.1 Surround Sound' }
  ],
  
  'monitors': [
    { key: 'Screen Size', label: 'Screen Size', required: true, placeholder: 'e.g., 27 inches' },
    { key: 'Resolution', label: 'Resolution', required: true, placeholder: 'e.g., 2560x1440 (QHD)' },
    { key: 'Panel Type', label: 'Panel Type', required: true, placeholder: 'e.g., Fast IPS' },
    { key: 'Refresh Rate', label: 'Refresh Rate', required: true, placeholder: 'e.g., 165Hz' },
    { key: 'Response Time', label: 'Response Time', required: false, placeholder: 'e.g., 1ms (GTG)' },
    { key: 'Brightness', label: 'Brightness', required: false, placeholder: 'e.g., 400 cd/m²' },
    { key: 'Contrast Ratio', label: 'Contrast Ratio', required: false, placeholder: 'e.g., 1000:1' },
    { key: 'Color Gamut', label: 'Color Gamut', required: false, placeholder: 'e.g., sRGB 99%' },
    { key: 'HDR', label: 'HDR', required: false, placeholder: 'e.g., HDR10' },
    { key: 'Adaptive Sync', label: 'Adaptive Sync', required: false, placeholder: 'e.g., G-SYNC Compatible' },
    { key: 'Connectivity', label: 'Connectivity', required: false, placeholder: 'e.g., DisplayPort 1.4, HDMI 2.0' },
    { key: 'USB Hub', label: 'USB Hub', required: false, placeholder: 'e.g., 2x USB 3.0' },
    { key: 'Adjustments', label: 'Adjustments', required: false, placeholder: 'e.g., Height, Tilt, Swivel, Pivot' }
  ],
  
  // Gaming Accessories
  'mouse': [
    { key: 'DPI', label: 'DPI', required: true, placeholder: 'e.g., 25,600 DPI' },
    { key: 'Sensor', label: 'Sensor', required: true, placeholder: 'e.g., HERO 25K Optical' },
    { key: 'Connectivity', label: 'Connectivity', required: true, placeholder: 'e.g., Wireless/Wired' },
    { key: 'Battery Life', label: 'Battery Life', required: false, placeholder: 'e.g., 60 hours' },
    { key: 'Buttons', label: 'Programmable Buttons', required: false, placeholder: 'e.g., 11 buttons' },
    { key: 'Weight', label: 'Weight', required: false, placeholder: 'e.g., 121g' },
    { key: 'Ergonomics', label: 'Ergonomics', required: false, placeholder: 'e.g., Right-handed' },
    { key: 'RGB Zones', label: 'RGB Zones', required: false, placeholder: 'e.g., 16.8M colors' }
  ],
  
  'keyboard': [
    { key: 'Switch Type', label: 'Switch Type', required: true, placeholder: 'e.g., Mechanical Cherry MX Red' },
    { key: 'Layout', label: 'Layout', required: true, placeholder: 'e.g., Full-size, TKL, 60%' },
    { key: 'Connectivity', label: 'Connectivity', required: true, placeholder: 'e.g., USB-C Wired' },
    { key: 'Keycaps', label: 'Keycaps', required: false, placeholder: 'e.g., Double-shot PBT' },
    { key: 'Backlighting', label: 'Backlighting', required: false, placeholder: 'e.g., Per-key RGB' },
    { key: 'Anti-ghosting', label: 'Anti-ghosting', required: false, placeholder: 'e.g., N-Key Rollover' },
    { key: 'Media Keys', label: 'Media Keys', required: false, placeholder: 'e.g., Dedicated volume wheel' },
    { key: 'Build Material', label: 'Build Material', required: false, placeholder: 'e.g., Aluminum frame' }
  ],
  
  'headset': [
    { key: 'Driver Size', label: 'Driver Size', required: true, placeholder: 'e.g., 50mm drivers' },
    { key: 'Frequency Response', label: 'Frequency Response', required: true, placeholder: 'e.g., 20Hz - 20kHz' },
    { key: 'Connectivity', label: 'Connectivity', required: true, placeholder: 'e.g., Wireless 2.4GHz + Bluetooth' },
    { key: 'Microphone', label: 'Microphone', required: false, placeholder: 'e.g., Detachable boom mic' },
    { key: 'Battery Life', label: 'Battery Life', required: false, placeholder: 'e.g., 20 hours' },
    { key: 'Surround Sound', label: 'Surround Sound', required: false, placeholder: 'e.g., 7.1 Virtual Surround' },
    { key: 'Noise Cancellation', label: 'Noise Cancellation', required: false, placeholder: 'e.g., Active Noise Cancellation' },
    { key: 'Compatibility', label: 'Compatibility', required: false, placeholder: 'e.g., PC, PS5, Xbox, Mobile' }
  ],
  
  // Laptops
  'gaming-laptop': [
    { key: 'Processor', label: 'Processor', required: true, placeholder: 'e.g., Intel Core i7-13700H' },
    { key: 'Graphics Card', label: 'Graphics Card', required: true, placeholder: 'e.g., NVIDIA RTX 4070 8GB' },
    { key: 'RAM', label: 'RAM', required: true, placeholder: 'e.g., 16GB DDR5-4800' },
    { key: 'Storage', label: 'Storage', required: true, placeholder: 'e.g., 1TB NVMe SSD' },
    { key: 'Display Size', label: 'Display Size', required: true, placeholder: 'e.g., 15.6 inches' },
    { key: 'Display Resolution', label: 'Display Resolution', required: true, placeholder: 'e.g., 1920x1080 (FHD)' },
    { key: 'Refresh Rate', label: 'Refresh Rate', required: false, placeholder: 'e.g., 144Hz' },
    { key: 'Panel Type', label: 'Panel Type', required: false, placeholder: 'e.g., IPS' },
    { key: 'Battery Life', label: 'Battery Life', required: false, placeholder: 'e.g., Up to 8 hours' },
    { key: 'Weight', label: 'Weight', required: false, placeholder: 'e.g., 2.5 kg' },
    { key: 'Keyboard', label: 'Keyboard', required: false, placeholder: 'e.g., RGB Backlit Gaming Keyboard' },
    { key: 'Ports', label: 'Ports', required: false, placeholder: 'e.g., USB-C, HDMI, Ethernet' },
    { key: 'Cooling', label: 'Cooling System', required: false, placeholder: 'e.g., Dual Fan Cooling' }
  ],
  
  'office-laptop': [
    { key: 'Processor', label: 'Processor', required: true, placeholder: 'e.g., Intel Core i5-1235U' },
    { key: 'Graphics', label: 'Graphics', required: false, placeholder: 'e.g., Intel Iris Xe Graphics' },
    { key: 'RAM', label: 'RAM', required: true, placeholder: 'e.g., 8GB DDR4-3200' },
    { key: 'Storage', label: 'Storage', required: true, placeholder: 'e.g., 512GB NVMe SSD' },
    { key: 'Display Size', label: 'Display Size', required: true, placeholder: 'e.g., 14 inches' },
    { key: 'Display Resolution', label: 'Display Resolution', required: true, placeholder: 'e.g., 1920x1080 (FHD)' },
    { key: 'Panel Type', label: 'Panel Type', required: false, placeholder: 'e.g., IPS Anti-glare' },
    { key: 'Battery Life', label: 'Battery Life', required: false, placeholder: 'e.g., Up to 12 hours' },
    { key: 'Weight', label: 'Weight', required: false, placeholder: 'e.g., 1.4 kg' },
    { key: 'Build Material', label: 'Build Material', required: false, placeholder: 'e.g., Aluminum' },
    { key: 'Security', label: 'Security Features', required: false, placeholder: 'e.g., Fingerprint Reader, TPM' },
    { key: 'Ports', label: 'Ports', required: false, placeholder: 'e.g., USB-C, USB-A, HDMI' },
    { key: 'Webcam', label: 'Webcam', required: false, placeholder: 'e.g., 1080p HD Camera' }
  ]
};

export const getSpecificationTemplate = (subCategory) => {
  return SPECIFICATION_TEMPLATES[subCategory] || [];
};

export const COMMON_FEATURES = {
  'graphics-card': [
    '4K Gaming Ready',
    'Ray Tracing Support',
    'DLSS 3.0',
    'RGB Lighting',
    'Dual Cooling Fans',
    'Zero RPM Mode',
    'Overclocking Support'
  ],
  'processors': [
    'Unlocked for Overclocking',
    'Intel Thread Director',
    'Integrated Graphics',
    'DDR5 Support',
    'PCIe 5.0 Support',
    'AI Acceleration'
  ],
  'memory': [
    'Low Profile Design',
    'XMP 2.0 Support',
    'Aluminum Heat Spreader',
    'Lifetime Warranty',
    'RGB Lighting',
    'Intel XMP Ready'
  ],
  'storage': [
    'NVMe 1.4 Support',
    'Gaming Optimized',
    'Low Power Consumption',
    'Hardware Encryption',
    '5-Year Warranty'
  ],
  'motherboards': [
    'RGB Lighting',
    'Reinforced PCIe Slots',
    'Premium Audio',
    'Fast Ethernet',
    'Wi-Fi 6E',
    'USB-C Support'
  ],
  'monitors': [
    'G-SYNC Compatible',
    'Fast IPS Panel',
    'HDR Support',
    'Low Input Lag',
    'Ergonomic Stand',
    'Blue Light Filter'
  ],
  
  // Gaming Accessories Features
  'mouse': [
    'High DPI Gaming Sensor',
    'RGB Lighting',
    'Programmable Buttons',
    'Wireless Connectivity',
    'Fast Charging',
    'Ergonomic Design',
    'Gaming Grade Materials'
  ],
  
  'keyboard': [
    'Mechanical Switches',
    'RGB Per-Key Lighting',
    'N-Key Rollover',
    'Media Controls',
    'Gaming Mode',
    'Programmable Macros',
    'Premium Build Quality'
  ],
  
  'headset': [
    'Surround Sound',
    'Active Noise Cancellation',
    'Detachable Microphone',
    'Wireless Connectivity',
    'Long Battery Life',
    'Comfortable Padding',
    'Multi-platform Compatible'
  ],
  
  // Laptop Features
  'gaming-laptop': [
    'High Refresh Rate Display',
    'RGB Keyboard Backlight',
    'Advanced Cooling System',
    'Gaming Mode Software',
    'High Performance GPU',
    'Fast NVMe Storage',
    'Multiple Display Support'
  ],
  
  'office-laptop': [
    'Long Battery Life',
    'Lightweight Design',
    'Fast Boot Time',
    'Security Features',
    'Professional Build',
    'Anti-glare Display',
    'Quiet Operation'
  ]
};