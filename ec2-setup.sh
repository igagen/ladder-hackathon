#!/usr/bin/bash

# System Setup

sudo apt-get update
sudo apt-get install git-core build-essential libssl-dev

# Install Node

# mkdir src
# git clone https://github.com/joyent/node.git src/node
# cd src/node

wget http://nodejs.org/dist/node-v0.4.11.tar.gz
tar xzf node-v0.4.11.tar.gz
cd node-v0.4.11/
 ./configure
JOBS=2 make
sudo make install
cd -

# Install NPM

git clone http://github.com/isaacs/npm.git
cd npm
sudo make install
cd -

# Install Global NPM Packages

sudo npm install -g coffee-script express

# Install Custom Global NPM Packages

git clone git://github.com/igagen/socketstream.git
# git clone https://github.com/socketstream/socketstream.git
cd socketstream
sudo npm install -g
cd -

# Install Redis

wget http://redis.googlecode.com/files/redis-2.2.12.tar.gz
tar xzf redis-2.2.12.tar.gz
cd redis-2.2.12
make
sudo cp src/redis-server /usr/local/bin
cd -

# Install MongoDB

sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo "deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen" | sudo tee -a /etc/apt/sources.list
sudo apt-get update
sudo apt-get install mongodb-10gen
sudo mkdir -p /data/db/
sudo chown `id -u` /data/db
