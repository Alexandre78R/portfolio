export type Project = {
  id: string;
  typeDisplay: string;
  contentDisplay: string;
  title: string;
  description: string;
  descriptionEN: string;
  descriptionFR: string;
  github: string;
  image: string | null;
  video: string | null;
  skills: { id: string; name: string; image: string }[];
};

export type ProjectComponent = {
  project: {
    id: string;
    typeDisplay: string;
    contentDisplay: string;
    title: string;
    description: string;
    descriptionEN: string;
    descriptionFR: string;
    github: string;
    image: string | null;
    video: string | null;
    skills: { id: string; name: string; image: string }[];
  };
};
