import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/comunidade", destination: "/", permanent: false },
      { source: "/ideias", destination: "/", permanent: false },
      { source: "/ideias/:id", destination: "/q/:id", permanent: false },
      { source: "/problemas", destination: "/", permanent: false },
      { source: "/problemas/:id", destination: "/q/:id", permanent: false },
      { source: "/webinars", destination: "/", permanent: false },
      { source: "/webinars/:id", destination: "/", permanent: false },
      { source: "/marketplace", destination: "/", permanent: false },
      { source: "/marketplace/:id", destination: "/", permanent: false },
      { source: "/agenda", destination: "/", permanent: false },
      { source: "/membros", destination: "/ranking", permanent: false },
      { source: "/cadastro", destination: "/entrar", permanent: false },
    ]
  },
}

export default nextConfig
