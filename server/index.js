const express = require("express")
const https = require("https")
const fs = require("fs")
const zlib = require("zlib")
const helmet = require("helmet")
const compress = require("compression")
const path = require('path');
const ws = express()
const domain = {
  ip: "127.0.0.1",
  port: 3000,
}
ws.use(helmet())
ws.use(
  compress({
    params: {
      [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_FONT,
      [zlib.constants.BROTLI_PARAM_QUALITY]: 9,
    },
  })
)
ws.use("/", express.static("public/home"));
ws.use("/404", express.static("public/status/404"))
ws.use("/src", express.static("public/src"))
ws.use("/bobby", express.static("public/bobby"))
ws.use((req, res, next) => {
  res.status(404).sendFile(path.resolve(__dirname, '..') + '/public/status/404/index.html');
})
ws.listen(domain.port, domain.ip, () => {
  console.log(`sup, server is up at ${domain.ip}:${domain.port}`)
})
