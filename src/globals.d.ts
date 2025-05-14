interface ImportMeta {
  env: {
    VITE_BASE_URL: string;
  };
}

/////////////////
// AUTH TYPES
/////////////////

type RegisterUser = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

type LoginUser = {
  username: string;
  password: string;
};

type AuthUser = {
  id: string;
  email: string;
  name: string;
  image: string;
};
