# gh-commentify

A repo you can use to work-around GH issue comment request limits by hosting your own server that makes authenticated requests on your behalf. You can find out more [in this blog post](http://artsy.github.io/blog/2017/07/15/Comments-are-on/)

It provides:

* The same comment route as GH's API `/repos/:owner/:repo/issues/:number/comments`
* Is locked to one org by default.
* Handles cross-domain requests
* Paginates under-the-hood for you, so you make one request
* Embeds comment Reactions into the request for you

```js
```

# Setup

1. Make a GitHub [personal access token](https://github.com/settings/tokens) for the server to use. It only needs `public_repo` if you have an public repo for comment. Otherwise, use `repo`.

2. Click: [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/orta/gh-commentify)

After that, you are done, pretty simple.
