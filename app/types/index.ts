export interface Education {
  collegeName: string;
  degree: string;
  branch: string;
  cgpa: string;
  yearOfStudy: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string;
  githubLink?: string;
}

export interface FormData {
  fullName: string;
  objective: string;
  education: Education[];
  skills: string; // Comma separated
  projects: Project[];
  achievements: string;
  certifications: string;
  email: string;
  linkedin: string;
  github: string;
}
