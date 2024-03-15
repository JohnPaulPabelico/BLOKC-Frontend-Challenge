/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.infura.io",
        port: "",
        pathname: "/ipfs/**",
      },
    ],
  },
};

export default nextConfig;
