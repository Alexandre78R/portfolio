export type Project = {
  id: string;
  typeDisplay: string;
  contentDisplay: string;
  title: string;
  description: string;
  github: string;
  skills: { id: string; name: string; image: string }[];
};

export type ProjectComponent = {
  project: {
    id: string;
    typeDisplay: string;
    contentDisplay: string;
    title: string;
    description: string;
    github: string;
    skills: { id: string; name: string; image: string }[];
  };
};
