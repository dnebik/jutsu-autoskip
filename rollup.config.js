import copy from 'rollup-plugin-copy';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import del from 'rollup-plugin-delete';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

const isProduction = process.env.BUILD === 'production';

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/JutsuAutoskip.js',
      format: 'cjs',
    },
    plugins: [
      del({
        targets: 'dist/*',
        runOnce: true,
      }),
      commonjs({
        exclude: ['*.scss'],
      }),
      nodeResolve({
        browser: true,
      }),
      copy({
        targets: [
          { src: 'static/**/*', dest: 'dist' },
        ],
      }),
      postcss({ inject: true }),
      isProduction && terser({ format: { comments: false } }),
    ],
  },
];
