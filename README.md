Installation on Ubuntu for this to work:

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
