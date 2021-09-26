// eslint-disable-next-line node/no-unpublished-import
import { fromRollup } from '@web/dev-server-rollup';
// eslint-disable-next-line node/no-unpublished-import
import rollupCommonjs from '@rollup/plugin-commonjs';
// eslint-disable-next-line node/no-unpublished-import
import rollupHtml from 'rollup-plugin-html';

const commonjs = fromRollup(rollupCommonjs);
const html = fromRollup(rollupHtml);

export default {
  mimeTypes: {
    // serve imported html files as js
    'src/editor/panels/*.html': 'js'
  },
  plugins: [
    html({ include: 'src/editor/panels/*.html' }),
    commonjs({
      exclude: [ 'src', 'dist', 'instrumented' ]
    })
  ]
};
