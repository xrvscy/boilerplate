const paths = require('./paths');
const path = require('path');
const antdVars = require('./antdVars');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

exports.resolve = {
  // This allows you to set a fallback for where Webpack should look for modules.
  // We placed these paths second because we want `node_modules` to "win"
  // if there are any conflicts. This matches Node resolution mechanism.
  // https://github.com/facebookincubator/create-react-app/issues/253
  modules: ['node_modules', paths.appNodeModules].concat(
    // It is guaranteed to exist because we tweak it in `env.js`
    process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
  ),
  // These are the reasonable defaults supported by the Node ecosystem.
  // We also include JSX as a common component filename extension to support
  // some tools, although we do not recommend using it, see:
  // https://github.com/facebookincubator/create-react-app/issues/290
  extensions: ['.js', '.json', '.jsx'],
  alias: {
    'react-native': 'react-native-web',
  },
  plugins: [
    // Prevents users from importing files from outside of src/ (or node_modules/).
    // This often causes confusion because we only process files within src/ with babel.
    // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
    // please link the files into your node_modules/ and let module-resolution kick in.
    // Make sure your source files are compiled, as they will not be processed in any way.
    new ModuleScopePlugin(paths.appSrc),
  ],
};

exports.vender = [
  'react',
  'react-dom'
];

exports.lessLoader = {
  options: {
    modifyVars: antdVars,
  }
};

exports.lodashPluginSets = {
  /** Iteratee shorthands for _.property, _.matches, & _.matchesProperty. */
  shorthands: true,
  /** Support “clone” methods & cloning source objects. */
  cloning: true,
  /** Support “curry” methods. */
  currying: true,
  /** Caches for methods like _.cloneDeep, _.isEqual, & _.uniq. */
  caching: true,
  /** Support objects in “Collection” methods. */
  collections: true,
  /** Support objects like buffers, maps, sets, symbols, typed arrays, etc. */
  exotics: true,
  /** Guards for host objects, sparse arrays, & other edge cases. */
  guards: true,
  /** Metadata to reduce wrapping of bound, curried, & partially applied functions.
   (requires currying) */
  metadata: true,
  /** Support deburring letters. */
  deburring: true,
  /** Support Unicode symbols. */
  unicode: true,
  /** Components to support chain sequences. */
  chaining: true,
  /** Support _.memoize & memoization. */
  memoizing: true,
  /** Support for coercing values to integers, numbers, & strings. */
  coercions: true,
  /** Support “flatten” methods & flattening rest arguments. */
  flattening: true,
  /** Deep property path support for methods like _.get, _.has, & _.set. */
  paths: true,
  /** Argument placeholder support for “bind”, “curry”, & “partial” methods.
   (requires currying) */
  placeholders: true,
};

// module.exports = ;
