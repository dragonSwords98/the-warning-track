#!/bin/bash

# install git
sudo apt-get update
sudo apt-get install git-all

# ssh keygen
ssh-keygen -t rsa -C "bry.ling@gmail.com" -b 4096
sudo apt-get install xclip
xclip -sel clip < ~/.ssh/id_rsa.pub

# User must put key on gitlab by pasting
# SSH must be enabled

# install nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
'\n source ~/.bashrc' >> .bash_profile

# Clone the repository
git clone git@gitlab.com:dragonSwords98/the-warning-track.git

# Ensure nvm is using node LTS version
nvm use --lts

# install & run
npm install
npm start