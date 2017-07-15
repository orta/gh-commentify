// @ts-check

const express = require("express")
const app = express()
const fetch = require("node-fetch")

app.get("/", function(req, res) {
  res.send("Hello World!")
})

app.set("port", process.env.PORT || 5000)

// e.g. https://api.github.com/repos/artsy/artsy.github.io/issues/355/comments
app.get("/repos/:owner/:repo/issues/:number/comments", (req, res) => {
  const gh = "https://api.github.com"
  if (req.params.owner !== process.env.ONLY_OWNER) {
    return res.status(401).json({ message: "Only can get comments with owner: " + process.env.ONLY_OWNER })
  }

  const route = [gh, "repos", req.params.owner, req.params.repo, "issues", req.params.number, "comments"]
  const url = route.join("/")

  // https://developer.github.com/v3/#authentication
  fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github.v3.html+json",
      Authorization: "token " + process.env.GITHUB_ACCESS_TOKEN,
    },
  })
    .then(response => {
      res.header("Access-Control-Allow-Origin", "*")
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")

      res.status(response.status)
      return response.json()
    })
    .then(json => {
      res.json(json)
    })
})

app.listen(app.get("port"), () => {
  console.log(`Started server at http://localhost:${process.env.PORT || 5000}`)
})
