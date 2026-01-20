// utils/avatarUtils.ts
export const getAvatarInitials = (name: string): string => {
  if (!name) return "U";

  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const getPatientAvatarPath = (id: string, gender: string = "Male") => {
  if (!id) return "";

  // Use a hash of the ID to pick a deterministic but seemingly random avatar
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const positiveHash = Math.abs(hash);

  if (gender.toLowerCase() === "male") {
    const index = (positiveHash % 18) + 1;
    return `/images/svgs/avatars/male/avatar-male-${index}.svg`;
  } else {
    const index = (positiveHash % 23) + 1;
    return `/images/svgs/avatars/female/avatar-female-${index}.svg`;
  }
};

export const getAvatarBg = (seed: string) => {
  if (!seed) return "bg-gray-200";

  const colors = [
    "bg-blue-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-yellow-200",
    "bg-indigo-200",
    "bg-teal-200",
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash % colors.length)];
};