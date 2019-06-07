/**
 * Big thanks to:
 * https://github.com/robsontenorio/lighthouse/blob/vuepress/docs/.vuepress/lib/versioning.js
 * and
 * https://github.com/vuejs/vuepress/issues/1018#issuecomment-440248700
 */

// TIP this file not work with hot reloading. You must restart server.

const versions = require('../versions.json')
const fse = require('fs-extra')
const path = process.cwd()


module.exports = {
  versions: {
    get latest () {
      return versions.slice(-1)[0]
    },
    get all () {
      return versions
    }
  },
  // Generate a single object that represents all versions from each sidebar
  // https://vuepress.vuejs.org/theme/default-theme-config.html#multiple-sidebars
  get sidebars () {
    let sidebars = {}

    versions.forEach((version) => {
      sidebars[`/${version}/`] = require(`../../${version}/sidebar.js`)
    })

    return sidebars
  },
  // Build dropdown items for each version
  linksFor (url) {
    let links = []

    versions.forEach(version => {
      let item = { text: version, link: `/${version}/${url}` }
      links.push(item)
    })

    return links
  },

}
