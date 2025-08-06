// Professional disc golf players and their bags - Using real disc IDs from the database
// This connects pro bags to actual disc data for proper navigation and details

export const proBags = [
  {
    id: 'paul-mcbeth',
    name: 'Paul McBeth',
    slug: 'paul-mcbeth',
    title: '6x World Champion',
    description: 'The most dominant player in disc golf history with 6 world championships.',
    image: 'https://via.placeholder.com/200x200/1e40af/ffffff?text=PM',
    backgroundColor: '#1e40af',
    color: '#ffffff',
    discIds: [
      // Drivers
      'a0be623e-60a3-5d27-8c2b-f1d2b863fa77', // Force
      '40a1de6e-e86c-5169-8a0d-0c7b5526f871', // Zeus
      'c4fa5c96-3fe9-5f03-830e-ee5657271aae', // Anax
      '3ee76b24-cccc-50d1-9ca9-76d81b03c86a', // Undertaker
      
      // Midranges
      'b61c0b30-f06b-5f66-a567-78287b003869', // Buzzz
      '7e21ab9a-410e-565f-8d63-d2501d9e0d54', // Malta
      'f9e72357-2714-53a1-8202-0dfb92d7630c', // Zone
      
      // Putters
      '2e1b74f4-dbda-54ba-84f1-2e0d0012980c', // Luna
      '89ce766b-d360-52b2-b9aa-2eae3da09254'  // Fierce
    ]
  },
  {
    id: 'paige-pierce',
    name: 'Paige Pierce',
    slug: 'paige-pierce',
    title: '5x World Champion',
    description: 'The most successful female disc golfer with 5 world championships.',
    image: 'https://via.placeholder.com/200x200/dc2626/ffffff?text=PP',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    discIds: [
      // Drivers
      'a0be623e-60a3-5d27-8c2b-f1d2b863fa77', // Force
      '40a1de6e-e86c-5169-8a0d-0c7b5526f871', // Zeus
      'da51df0e-57f0-5819-8648-87bc7ae79fb2', // Passion
      '9a2b6c06-18b9-51cc-90f8-3620d62a4bc0', // Stalker
      
      // Midranges
      'b61c0b30-f06b-5f66-a567-78287b003869', // Buzzz
      '7e21ab9a-410e-565f-8d63-d2501d9e0d54', // Malta
      'f9e72357-2714-53a1-8202-0dfb92d7630c', // Zone
      
      // Putters
      '2e1b74f4-dbda-54ba-84f1-2e0d0012980c', // Luna
      '89ce766b-d360-52b2-b9aa-2eae3da09254'  // Fierce
    ]
  },
  {
    id: 'calvin-heimburg',
    name: 'Calvin Heimburg',
    slug: 'calvin-heimburg',
    title: 'Elite Series Champion',
    description: 'Known for his incredible accuracy and smooth throwing style.',
    image: 'https://via.placeholder.com/200x200/059669/ffffff?text=CH',
    backgroundColor: '#059669',
    color: '#ffffff',
    discIds: [
      // Drivers
      'aa24b5ff-cd19-5c17-9d1c-15b8ff270032', // Destroyer
      '57ef9880-dffc-5723-ad10-921ffc05add6', // Wraith
      '89bd794c-d3e0-507b-bedd-ae9d623017ea', // Firebird
      '64b35298-f452-51bf-93e3-837c503181a0', // Teebird3
      
      // Midranges
      '3d227e94-bec4-5e1f-a3ff-4705421c7373', // Roc3
      '4f1b607e-9f86-5347-a140-ff38315b108a', // Lion
      '0d24de0d-c1db-550f-82f6-faf344da5993', // Caiman
      
      // Putters
      'eed34997-fe11-58b4-8958-302d6a089012', // Aviar3
      '374c6bb6-c355-5c36-b8ef-50e81ecc8558'  // AviarX3
    ]
  },
  {
    id: 'ricky-wysocki',
    name: 'Ricky Wysocki',
    slug: 'ricky-wysocki',
    title: '2x World Champion',
    description: 'Known for his powerful arm and clutch performances in major tournaments.',
    image: 'https://via.placeholder.com/200x200/7c3aed/ffffff?text=RW',
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    discIds: [
      // Drivers
      'aa24b5ff-cd19-5c17-9d1c-15b8ff270032', // Destroyer
      'fe6bb717-1465-5bbf-b095-aa45968fe305', // Boss
      '094a3abc-fc9c-5134-aab7-a6029cec8291', // Thunderbird
      'e0543efb-dab0-54fa-8905-a7c0ef627c53', // Teebird
      
      // Midranges
      '3d227e94-bec4-5e1f-a3ff-4705421c7373', // Roc3
      '91c14ab3-8c1b-508f-9870-bc6a798a2781', // Mako3
      'ecdd0f49-b7b0-5cee-bc1a-25a030425f99', // Gator
      
      // Putters
      'ce733ef4-176c-5c3a-858c-8f83d05a4729', // Aviar P&A (closest match)
      '028808c6-229b-50ca-9952-85152cf4e25d'  // Pig
    ]
  },
  {
    id: 'eagle-mcmahon',
    name: 'Eagle McMahon',
    slug: 'eagle-mcmahon',
    title: 'Distance World Record Holder',
    description: 'Known for his incredible distance and creative shot-making ability.',
    image: 'https://via.placeholder.com/200x200/ea580c/ffffff?text=EM',
    backgroundColor: '#ea580c',
    color: '#ffffff',
    discIds: [
      // Drivers
      'df04c173-54bc-5cc1-899a-f335c942b6c2', // Cloudbreaker
      'e7592d1e-82a9-55ae-be4b-4a7badc17714', // PD
      '3fd8a291-5b6a-51e6-8ddc-b6412437ae44', // FD
      '49e5aa4f-ced1-5659-98b2-fa37ac30dc81', // Tilt
      
      // Midranges
      '65e29e78-61a8-5d3c-b987-c061aca29212', // MD3
      '87ab53a5-1afb-5f29-98e4-b89c90ebbace', // MD1
      'a1564d47-5fb9-57dc-960f-5e8b17e93457', // A1 (Prodigy - but closest match)
      
      // Putters
      '201b4605-2345-5d37-87bd-d10e53e98864', // P2
      '57922c2d-2995-58f4-a9c0-fc559ab105e0'  // Link
    ]
  },
  {
    id: 'catrina-allen',
    name: 'Catrina Allen',
    slug: 'catrina-allen',
    title: 'World Champion',
    description: 'Known for her consistent play and strong mental game.',
    image: 'https://via.placeholder.com/200x200/be185d/ffffff?text=CA',
    backgroundColor: '#be185d',
    color: '#ffffff',
    discIds: [
      // Drivers
      'aa24b5ff-cd19-5c17-9d1c-15b8ff270032', // Destroyer
      '57ef9880-dffc-5723-ad10-921ffc05add6', // Wraith
      '094a3abc-fc9c-5134-aab7-a6029cec8291', // Thunderbird
      '9531e07b-9bd1-5607-958b-7674af1b1940', // Leopard3
      
      // Midranges
      '3d227e94-bec4-5e1f-a3ff-4705421c7373', // Roc3
      '91c14ab3-8c1b-508f-9870-bc6a798a2781', // Mako3
      '36e738b5-fbe8-5011-930a-7ddf496f78ba', // Rat
      
      // Putters
      'ce733ef4-176c-5c3a-858c-8f83d05a4729', // Aviar P&A (closest match)
      '02d1c1ff-9381-5906-b87f-d48de2fe3186'  // Rhyno
    ]
  }
];

// Helper function to get a pro by slug
export const getProBySlug = (slug) => {
  return proBags.find(pro => pro.slug === slug);
};

// Helper function to get all pros
export const getAllPros = () => {
  return proBags;
};