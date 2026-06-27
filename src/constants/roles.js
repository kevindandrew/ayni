export const ROLES = {
  ADMIN: "admin",
  CITIZEN: "citizen",
  VOLUNTEER: "volunteer",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Administrador",
  [ROLES.CITIZEN]: "Ciudadano",
  [ROLES.VOLUNTEER]: "Voluntario",
};

// Mock users — replace with real API calls later
export const MOCK_USERS = [
  {
    id: 1,
    name: "Carlos Admin",
    email: "admin@ayni.com",
    password: "admin123",
    role: ROLES.ADMIN,
    avatar: "CA",
  },
  {
    id: 2,
    name: "María López",
    email: "ciudadano@ayni.com",
    password: "user123",
    role: ROLES.CITIZEN,
    avatar: "ML",
  },
  {
    id: 3,
    name: "Juan Voluntario",
    email: "voluntario@ayni.com",
    password: "vol123",
    role: ROLES.VOLUNTEER,
    avatar: "JV",
  },
];
