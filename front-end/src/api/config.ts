const env_url = import.meta.env.VITE_BACKEND_URL
if (!env_url) {
    console.error("Error. VITE_BACKEND_URL env variable not set.")
}

export const BACK_END_URL = env_url