import babel from 'rollup-plugin-babel';

export default {
  format: 'umd',
  sourceMap: true,
  entry: 'src/main.js',
  plugins: [ babel() ],
  moduleName: 'FixedHeader',
  dest: 'dist/fixed-header.js'
};