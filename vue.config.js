const deployTargetsToPublicPaths = {
  pf: "",
  ashlinme: "/membrane/",
  default: ""
};

function getPublicPath() {
  const foundPublicPath =
    deployTargetsToPublicPaths[process.env.VUE_APP_DEPLOY_TARGET];
  return foundPublicPath ? foundPublicPath : deployTargetsToPublicPaths.default;
}

module.exports = {
  lintOnSave: false,
  publicPath: getPublicPath(),
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    disableHostCheck: true
  }
};
