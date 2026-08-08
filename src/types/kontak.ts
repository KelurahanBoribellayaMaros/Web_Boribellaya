export type KontakPerson = {
  jabatan: string;
  whatsapp: string;
};

export type KontakInfo = {
  address: string;
  contacts: KontakPerson[];
  email: string;
  hours: string;
  mapsEmbedUrl?: string;
};
