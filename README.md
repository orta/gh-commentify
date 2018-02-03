# gh-commentify

A repo you can use to work-around GH issue comment request limits by hosting your own server that makes authenticated requests on your behalf. You can find out more [in this blog post](http://artsy.github.io/blog/2017/07/15/Comments-are-on/)

It uses the same routes as GH's API `/repos/:owner/:repo/issues/:number/comments`, so you can just change the base URL.

The JSON will contain all of the comments (pagination is handled for you) and all their reactions embedded.

# Setup

1. Make a GitHub [personal access token](https://github.com/settings/tokens) for the server to use. It only needs `public_repo` if you have an public repo for comment. Otherwise, use `repo`.

2. Click: [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/orta/gh-commentify)

After that, you are done, pretty simple.
