/**
 * Docs https://tsdx.io/
 * Docs npm https://www.npmjs.com/package/tsdx
 * Top plugins: https://github.com/rollup/plugins
 */

// tsdx plugin for export css on module
const postcss = require('rollup-plugin-postcss')
// PostCSS plugin to parse CSS and add vendor prefixes to CSS rules using values from Can I Use. It is recommended by Google and used in Twitter and Alibaba.
const autoprefixer = require('autoprefixer')
// cssnano takes your nicely formatted CSS and runs it through many focused optimisations, to ensure that the final result is as small as possible for a production environment.
const cssnano = require('cssnano')
// tsdx plugin for export image on module
const images = require('@rollup/plugin-image')

module.exports = {
  rollup(config, options) {
    config.plugins = [
      postcss({
        // options: https://www.npmjs.com/package/rollup-plugin-postcss
        plugins: [
          autoprefixer(),
          cssnano({
            preset: 'default'
          })
        ],
        inject: true,
        // only write out CSS for the first bundle (avoids pointless extra files):
        // extract: !!options.writeMeta
      }),
      images({ include: ['**/*.png', '**/*.jpg'] }),
      ...config.plugins
    ]
	if(process.env.NODE_ENV === "production"){
		delete config.output.file;
		config.output.dir = "./dist";
	}else{
		config.inlineDynamicImports = true;
	}

    return config
  }
}
