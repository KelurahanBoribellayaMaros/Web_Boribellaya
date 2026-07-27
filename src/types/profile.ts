export type Leader = {
  name: string;
  position: string;
  nip: string;
  photo?: string;
  bio: string;
  email: string;
  term: string;
};

export type OrgNode = {
  name: string;
  position: string;
  children?: OrgNode[];
};
