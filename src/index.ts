import appRunner from "./github"

const DEFAULT_PORT = Number(process.env.PORT) || 5000
appRunner(DEFAULT_PORT)