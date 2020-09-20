module.exports = {
  description: "Add Yearn tokens to Metamask",
  base: "/",
  ga: "UA-115756440-2",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["script", { src: "/assets/js/web3.min.js" }],
  ],
  defaultNetwork: "mainnet",
  infuraProjectId: "4f8bf400ab354820998e6dfdea0a1b78",
};
