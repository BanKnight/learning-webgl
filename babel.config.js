module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  
    "targets": {
      "chrome": "80",
      "node": "14"
    },

  plugins:[
    "@babel/plugin-proposal-export-default-from"
  ]
}
