<h2>Installation on Ubuntu:</h2>

- Create a user and add to sudoers, switch to that user.
- Install NVM:
  - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
- Install nodejs
  - `nvm install 16.15.1`
- Clone this repository
  - `git clone https://github.com/mongopusher/consumeter-webserver.git`
  - `cd consumeter-webserver`
- Build and run the project:
  - `npm run build`
  - `npm run start:prod`

<h2>Database:</h2>

- Install postgresql (https://www.postgresql.org/download/linux/ubuntu/):
  - `sudo apt-get install postgresql-12`
- Run postgresql:
  - `sudo -u postgres psql`
- Configuring postgresql:
  - `create database consumeter;`
  - `create user consumer with encrypted password 'PASSWORD';`
  - `grant all privileges on database consumeter to consumer;`
- (Re-)initiate the database:
  - `npx nps db.clean`

<h2>Useful commands: </h2>

- Postgres:
  - `\l` list all databases
  - `\c database` connects to database
  - `\dt` display tables in a database

- Authorization:
  - you need to generate a pair of rsa keys and store them in ./resources
  - you can generate a pair of keys with openssl like this:
  - `openssl genrsa -out private.key 4096`
  - `openssl rsa -in private.key -outform PEM -pubout -out public.key`
  - Note: the **private.key** file should never be part of your projects source but instead should be at a protected location on your server