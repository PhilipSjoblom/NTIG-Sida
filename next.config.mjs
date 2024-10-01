/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    distDir: 'dist',
    assetPrefix: "./",

    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
