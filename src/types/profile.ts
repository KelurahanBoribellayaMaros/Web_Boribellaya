export type Leader = {
  name: string;
  position: string;
  nip: string;
  photo?: string;
};

export type OrgNode = {
  id: string;
  name: string;
  position: string;
  nip?: string;
  photo?: string;
  children: OrgNode[];
};
