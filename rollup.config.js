import copy from 'rollup-plugin-copy';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import sass from 'rollup-plugin-sass';

export default {
  input: ['src/index.js', 'src/styles/settings.scss'],
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [
    commonjs(),
    nodeResolve({ browser: true }),
    sass({ output: 'dist/main.css' }),
    copy({
      targets: [
        { src: 'static/**/*', dest: 'dist' },
      ],
    }),
  ],
};
