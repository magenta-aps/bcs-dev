# Vagrant setup for BCS development
#### A virtualbox-powered VM running CentOS 7 for BComeSafe development
##### Configuration
Runs out-of-the-box with `vagrant up`. Change environment variables in the various files
provided in the repo as needed.

NOTE: To use default ports (80 + 443), vagrant must be run as a privileged process,
eg. `sudo vagrant up`. If this is not desirable, you can locally re-route ports 80 and
443 to eg. 10080 and 10443 and update the top of the Vagrantfile accordingly.
  
To access the server, `vagrant ssh` and get the IP address using `ifconfig`. User
registration is now available on `<ip address>/auth/register`  

Provisioning output is available in `~/provision.log` on the VM. Errors and echo statements
are printed to stdout, while warnings are generally suppressed.

##### Prerequisites
* Vagrant + Virtualbox
* (Optional) A running ssh agent with access to the VoKS-repos (to allow `git push`)

##### TODO
* Configure network to use static IP/localhost
* Refactor env variables (using Ansible?)
* Further clean up logging output
