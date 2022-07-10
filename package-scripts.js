module.exports = {
  scripts: {
    start: {
      default: 'nodemon',
      prod: 'node dist/main',
    },
    lint: {
      default: 'node_modules/.bin/eslint \"{src,apps,libs,test}/**/*.ts\" --fix',
    },
    test: {
      default: 'node_modules/.bin/jest',
      watch: 'node_modules/.bin/jest --watch',
      cov: 'node_modules/.bin/jest --coverage',
      debug: 'node --inspect-brk -r tsconfig-paths/register -r ts-node/register consumeter-webserver/node_modules/.bin/jest --runInBand',
      e2e: 'node_modules/.bin/jest --config ./test/jest-e2e.json',
    },
    db: {
      drop: 'npm run typeorm schema:drop',
      create: 'npm run typeorm migration:generate -n --',
      migrate: 'npm run typeorm migration:run',
      clean: 'rm -rf src/migrations/* && nps db.drop && nps "db.create src/migrations/rollback" && nps db.migrate',
    },
    build: 'node_modules/.bin/nest build',
    format: 'node_modules/.bin/prettier --write \\\"src/**/*.ts\\\" \\\"test/**/*.ts\\\"',
  },
};