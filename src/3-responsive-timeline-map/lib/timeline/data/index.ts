import type { TimelineNodeData } from "../engine/types";

export const data: TimelineNodeData[] = [
  // Commitments - education and long-running positions
  {
    id: "university-undergraduate-degree",
    type: "commitment",
    date: "2017-09-01",
    endDate: "2021-07-01",
    title: "Bachelor of Science",
    organization: "University of Applied Technology",
    organizationLogoUrl: "/logos/university.svg",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Completed a Bachelor of Science focused on technology, engineering, and applied problem solving.",
    preferredSide: "below",
  },
  {
    id: "acme-intern-swe",
    type: "commitment",
    date: "2019-09-01",
    endDate: "2020-07-01",
    title: "Intern",
    organization: "ACME Inc.",
    organizationLogoUrl: "/logos/acme.svg",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Started at ACME as a software engineering intern, contributing to real-world product development.",
  },
  {
    id: "acme-junior-swe",
    type: "commitment",
    date: "2021-10-01",
    endDate: "2022-12-01",
    title: "Junior SWE",
    organization: "ACME Inc.",
    organizationLogoUrl: "/logos/acme.svg",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Moved into a junior engineering role, building features and contributing to production applications.",
  },
  {
    id: "university-graduate-degree",
    type: "commitment",
    date: "2022-09-01",
    endDate: "2024-07-01",
    title: "Master of Science",
    organization: "University of Applied Technology",
    organizationLogoUrl: "/logos/university.svg",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Earned a Master of Science while deepening expertise in software and applied technology.",
    preferredSide: "below",
  },
  {
    id: "tech-for-good-volunteer",
    type: "commitment",
    date: "2023-09-01",
    ongoing: true,
    title: "Volunteer",
    organization: "Tech for Good NCO",
    organizationLogoUrl: "/logos/tech-for-good.svg",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Volunteer technical skills on projects using technology to create positive social impact.",
  },
  {
    id: "acme-middle-developer",
    type: "commitment",
    date: "2022-12-01",
    endDate: "2024-12-01",
    title: "Middle SWE",
    organization: "ACME Inc.",
    organizationLogoUrl: "/logos/acme.svg",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Advanced to a mid-level engineering role, owning larger features and contributing across the stack.",
  },
  {
    id: "wayne-enterprises-senior-developer",
    type: "commitment",
    date: "2024-12-01",
    ongoing: true,
    title: "Senior SWE",
    organization: "Wayne Enterprises",
    organizationLogoUrl: "/logos/wayne-enterprises.svg",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Currently working as a senior software engineer at Wayne Enterprises, leading technical work and mentoring teammates.",
  },

  // Projects - standalone projects, gigs, awards, and events
  {
    id: "super-hackaton-2021-hackaton-winner",
    type: "project",
    date: "2020-06-01",
    title: "Hackaton winner",
    organization: "Super Hackaton 2021",
    organizationLogoUrl: "/logos/super-hackaton-2021.svg",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    summary: "Won first place at Super Hackaton with a practical technology-focused prototype.",
    preferredSide: "below",
  },
  {
    id: "modern-tech-2025-organizer",
    type: "project",
    date: "2025-07-01",
    title: "Conference organizer",
    organization: "Modern Tech 2025",
    organizationLogoUrl: "/logos/modern-tech-2025.svg",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Organized Modern Tech 2025, coordinating speakers, logistics, and the developer community.",
    preferredSide: "below",
  },
];
