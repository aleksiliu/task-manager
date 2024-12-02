/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.forEach((rule) => {
      const { oneOf } = rule;
      if (oneOf) {
        oneOf.forEach((one) => {
          if (!`${one.test}`.includes('css')) return;
          
          one.use.forEach((loader) => {
            if (loader.loader?.includes('css-loader') && !loader.loader?.includes('postcss-loader')) {
              const { getLocalIdent, ...others } = loader.options.modules;
              
              loader.options = {
                ...loader.options,
                modules: {
                  ...others,
                  getLocalIdent: (context, localIdentName, localName) => localName,
                },
              };
            }
          });
        });
      }
    });
    return config;
  },
};

module.exports = nextConfig; 