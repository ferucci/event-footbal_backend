const dotenv = require("dotenv")
const path = require("node:path")
dotenv.config({ path: path.join(__dirname, "..", ".env.deploy") })

const {
  DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REF, DEPLOY_REPO
} = process.env;

module.exports = {
  apps: [{
    name: "okko",
    script: "dist/src/main.js"
  }],
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      'pre-deploy-local': `bash scripts/deployEnv.sh ${DEPLOY_USER}@${DEPLOY_HOST} ${DEPLOY_PATH}`,
      'post-deploy': 'pwd && npm ci && npm run build && pm2 startOrRestart ecosystem.config.js --env production',
    },
  },
}
