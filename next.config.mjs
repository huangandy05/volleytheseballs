/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "volleyballxpert.com",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "as2.ftcdn.net",
        port: "",
        pathname: "/v2/jpg/**",
      },
    ],
  },
};

export default nextConfig;
