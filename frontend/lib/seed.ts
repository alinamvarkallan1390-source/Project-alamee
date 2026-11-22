export const seedSettings: Record<string, string> = {
  company_name: 'ALAMEE',
  tagline: "Building Tomorrow's Landmarks",
  hero_title: 'We Build Icons. Not Just Buildings.',
  hero_subtitle: 'Ultra-premium architecture, engineering and development — crafted in 3D, delivered in reality.',
  primary_color: '#C9A96A',
  background_color: '#0A0A0B',
  font_family: 'Inter',
  rotation_speed: '0.35',
  camera_speed: '1',
  lighting_intensity: '1.2',
  contact_email: 'info@alamee.com',
  contact_phone: '+31 20 240 0000',
  contact_address: 'Herengracht 420, Amsterdam, Netherlands',
  stats_projects: '128',
  stats_years: '18',
  stats_area: '2.4M',
  stats_team: '340'
};

export const seedProjects = [
  { id: 'p1', title: 'The Meridian Tower', slug: 'meridian-tower', description: 'A 42-storey glass icon on the Zuidas skyline with sky gardens and a champagne-gold crown.', location: 'Amsterdam, Netherlands', category: 'Commercial', status: 'Completed', completion_date: '2024-06-15', area_sqm: 68000, floors: 42, units: 0, cover_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80', is_published: true, sort_order: 1 },
  { id: 'p2', title: 'Villa Lumière', slug: 'villa-lumiere', description: 'Private waterfront villa with infinity pool, private spa and panoramic glass walls.', location: 'Rotterdam, Netherlands', category: 'Residential', status: 'Completed', completion_date: '2023-11-02', area_sqm: 2400, floors: 3, units: 1, cover_image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80', is_published: true, sort_order: 2 },
  { id: 'p3', title: 'The Aurelia Residences', slug: 'aurelia-residences', description: "Luxury residential tower with penthouse collection and residents' club.", location: 'Antwerp, Belgium', category: 'Residential', status: 'Ongoing', completion_date: '2026-09-30', area_sqm: 45000, floors: 28, units: 180, cover_image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80', is_published: true, sort_order: 3 },
  { id: 'p4', title: 'Haven Commercial Hub', slug: 'haven-hub', description: 'Mixed-use business hub with atrium, co-working floors and retail podium.', location: 'Düsseldorf, Germany', category: 'Commercial', status: 'Ongoing', completion_date: '2027-03-15', area_sqm: 52000, floors: 18, units: 0, cover_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80', is_published: true, sort_order: 4 },
  { id: 'p5', title: 'Palazzo Verde', slug: 'palazzo-verde', description: 'Sustainable office tower with living facades and net-zero operations.', location: 'Paris, France', category: 'Commercial', status: 'Planned', completion_date: '2028-01-20', area_sqm: 39000, floors: 22, units: 0, cover_image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80', is_published: true, sort_order: 5 },
  { id: 'p6', title: 'The Crown Hotel', slug: 'crown-hotel', description: 'Five-star hotel and branded residences above the historic centre.', location: 'Vienna, Austria', category: 'Hospitality', status: 'Planned', completion_date: '2028-06-10', area_sqm: 31000, floors: 26, units: 220, cover_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', is_published: true, sort_order: 6 }
];

export const seedServices = [
  { id: 's1', title: 'Architecture', description: 'Award-winning architectural design, from concept to detailed construction documentation.', icon: 'building', sort_order: 1, is_published: true },
  { id: 's2', title: 'Construction', description: 'Precision general contracting with in-house teams and zero-compromise quality control.', icon: 'crane', sort_order: 2, is_published: true },
  { id: 's3', title: 'Engineering', description: 'Structural, MEP and facade engineering for the most demanding towers.', icon: 'drafting', sort_order: 3, is_published: true },
  { id: 's4', title: 'Interior Design', description: 'Bespoke interiors — marble, brass, oak — tailored to each landmark.', icon: 'sofa', sort_order: 4, is_published: true },
  { id: 's5', title: 'Real Estate Development', description: 'End-to-end development: land, permits, finance, build and delivery.', icon: 'key', sort_order: 5, is_published: true }
];

export const seedSections = [
  { id: 'sec1', key: 'hero', title: 'We Build Icons', subtitle: 'Not Just Buildings', content: 'Cinematic 3D hero', enabled: true, sort_order: 1 },
  { id: 'sec2', key: 'about', title: 'About ALAMEE', subtitle: 'Two decades of architectural excellence', content: 'ALAMEE is a luxury construction and development house crafting landmarks across Europe.', enabled: true, sort_order: 2 },
  { id: 'sec3', key: 'projects', title: 'Selected Works', subtitle: 'Landmarks across Europe', content: 'Premium project gallery', enabled: true, sort_order: 3 },
  { id: 'sec4', key: 'services', title: 'What We Do', subtitle: 'End-to-end excellence', content: 'Architecture, construction, engineering, interiors, development', enabled: true, sort_order: 4 },
  { id: 'sec5', key: 'process', title: 'Our Process', subtitle: 'From vision to skyline', content: 'Interactive construction timeline', enabled: true, sort_order: 5 },
  { id: 'sec6', key: 'stats', title: 'By The Numbers', subtitle: 'Proven scale', content: 'Completed projects, years, area, team', enabled: true, sort_order: 6 },
  { id: 'sec7', key: 'contact', title: 'Contact', subtitle: 'Start your project', content: 'Interactive contact form', enabled: true, sort_order: 7 }
];
