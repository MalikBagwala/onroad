#!/bin/bash

# Create a dynamic unique identifier for the comment
comment="Droplet_$(hostname)"

# Update the package list and upgrade the system
echo -e "\e[96mUpdating and upgrading the system...\e[0m"
sudo apt update && sudo apt upgrade -y

# Create a new user
echo -e "\e[96mCreating a new user 'onroad'...\e[0m"
sudo adduser onroad
sudo usermod -aG sudo onroad

# Switch to the new user
su - onroad

# Install Homebrew
echo -e "\e[96mInstalling Homebrew...\e[0m"
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo 'eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)' >> ~/.bashrc
source ~/.bashrc
echo -e "\e[92mHomebrew has been installed - $(brew --version)\e[0m"

# Install Docker
echo -e "\e[96mInstalling Docker...\e[0m"
brew install docker
echo -e "\e[92mDocker has been installed - $(docker --version)\e[0m"

# Install AWS CLI
echo -e "\e[96mInstalling AWS CLI...\e[0m"
brew install aws
echo -e "\e[92mAWS CLI has been installed - $(aws --version)\e[0m"

# Install xclip
echo -e "\e[96mInstalling xclip...\e[0m"
brew install xclip
echo -e "\e[92mxclip has been installed - $(xclip -version)\e[0m"

# Generate SSH key with Ed25519, no passphrase, and dynamic comment
echo -e "\e[96mGenerating SSH key with Ed25519...\e[0m"
ssh-keygen -t ed25519 -N "" -C "$comment"

# Copy the public key to the clipboard using xclip and display the key
xclip -sel clip < ~/.ssh/id_ed25519.pub
cat ~/.ssh/id_ed25519.pub

# Display a message indicating the key has been copied
echo -e "\e[92mSSH key has been generated and copied to the clipboard."
echo "Comment: $comment\e[0m"
