# build-gulp

[![NPM Downloads][downloads-image]][downloads-url]
[![NPM Version][version-image]][version-url]
[![License][license-image]][license-url]
[![Dependency Status][dependency-image]][dependency-url]
[![devDependency Status][devdependency-image]][devdependency-url]
[![Code Style][style-image]][style-url]

> static web app workflow

## Installation

```shell
$ yarn add build-gulp

# or npm
$ npm install build-gulp
```

## Usage

<!-- TODO: Introduction of API use -->

```javascript
const zcePages = require('build-gulp')
const result = zcePages('zce')
// result => 'zce@zce.me'
```

## API

<!-- TODO: Introduction of API -->

### zcePages(name[, options])

#### name

- Type: `string`
- Details: name string

#### options

##### host

- Type: `string`
- Details: host string
- Default: `'zce.me'`

## Contributing

1. **Fork** it on GitHub!
2. **Clone** the fork to your own machine.
3. **Checkout** your feature branch: `git checkout -b my-awesome-feature`
4. **Commit** your changes to your own branch: `git commit -am 'Add some feature'`
5. **Push** your work back up to your fork: `git push -u origin my-awesome-feature`
6. Submit a **Pull Request** so that we can review your changes.

> **NOTE**: Be sure to merge the latest from "upstream" before making a pull request!

## License

[MIT](LICENSE) &copy; zce <w@zce.me> (https://zce.me)



[downloads-image]: https://img.shields.io/npm/dm/build-gulp.svg
[downloads-url]: https://npmjs.org/package/build-gulp
[version-image]: https://img.shields.io/npm/v/build-gulp.svg
[version-url]: https://npmjs.org/package/build-gulp
[license-image]: https://img.shields.io/github/license/zce/build-gulp.svg
[license-url]: https://github.com/zce/build-gulp/blob/master/LICENSE
[dependency-image]: https://img.shields.io/david/zce/build-gulp.svg
[dependency-url]: https://david-dm.org/zce/build-gulp
[devdependency-image]: https://img.shields.io/david/dev/zce/build-gulp.svg
[devdependency-url]: https://david-dm.org/zce/build-gulp?type=dev
[style-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[style-url]: https://standardjs.com
