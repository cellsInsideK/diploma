const link = import.meta.env.VITE_SUPABASE_LINK;

export const getPublicImageUrl = (name: string) => {
  return `${link}/storage/v1/object/public/images/${name}?width=150&height=150`;
};
