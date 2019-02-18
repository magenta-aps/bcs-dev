Vagrant.configure("2") do |config|
  config.vm.box = "centos/7"
#  config.vm.network "public_network"
  config.vm.network "private_network", type: "dhcp"
  config.vm.provider "virtualbox" do |vb|   
    vb.memory = "2048"
    vb.cpus = 2
  end

  config.ssh.forward_agent = true

  config.vm.provision "file", source: "./provision_files/.", destination: "~/."
  config.vm.provision "shell", privileged: false, inline: <<-SHELL

    # open fd=3 redirecting to 1 (stdout)
    exec 3>&1

    # function echo to show echo output on terminal
    echo() {
       # call actual echo command and redirect output to fd=3 and log file
       command echo "$@"
       command echo "$@" >&3
    }

    # redirect stdout to a log file
    exec >> provision.log

    echo "Updating repos"

    sudo rpm -Uvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
    sudo rpm -Uvh https://mirror.webtatic.com/yum/el7/webtatic-release.rpm

    sudo yum history sync
    sudo yum update -y

#    sudo firewall-cmd --permanent --add-port=9000/tcp
#    sudo firewall-cmd --permanent --add-port=9001/tcp

    echo "Installing packages"
    sudo yum install mc nmap htop -y

    sudo yum install wget -y
    sudo wget http://repo.mysql.com/mysql-community-release-el7-5.noarch.rpm
    sudo rpm -ivh mysql-community-release-el7-5.noarch.rpm
    sudo yum update -y
    sudo yum install mysql-server -y

    echo "Starting mysqld & creating BCS db"
    sudo systemctl start mysqld
    sudo mysql -u root --execute="create database bcs; grant all on bcs.* to 'bcs'@'localhost' identified by 'bcs';"


    echo "Installing PHP"
    sudo yum install php56w php56w-mysql php56w-pdo php56w-pecl-redis php56w-mbstring php56w-libxml php56w-ldap php56w-opcache php56w-pear php56-pecl-imagick php56w-mcrypt php56w-common -y

    echo "Installing Node.js"
    curl -sL https://rpm.nodesource.com/setup_6.x | sudo bash -
    sudo yum install nodejs -y

    sudo yum install git -y

    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer

    sudo mv ~/httpd.conf /etc/httpd/conf/httpd.conf

    sudo yum install supervisor -y
    sudo mv ~/supervisord.conf /etc/supervisord.conf
    sudo mv ~/supervisord/ /etc/

    echo "Starting supervisord"
    sudo service supervisord start

    sudo setsebool httpd_can_sendmail 1
    sudo setsebool httpd_can_network_connect 1

    sudo mv ~/logrotate_httpd /etc/logrotate.d/httpd
    echo "Adding vagrant user to apache group"
    sudo usermod -a -G apache vagrant

    echo "Cloning shelter"
    cd /var/www/
    sudo git clone https://github.com/magenta-aps/VoKS-shelter.git /var/www/html/application

    sudo mkdir -p /var/www/html/application/public/uploads/maps
    sudo chmod -R 0755 /var/www/html/application/public/uploads/

    sudo mv ~/.env /var/www/html/application/

    sudo chmod -R 777 /var/www/html/application/
    cd /var/www/html/application/

    echo "composer install"
    composer install
    echo "artisan migrate"
    php artisan migrate

    echo "bower install"
    sudo npm install bower -g
    bower install --allow-root

    sudo npm install gulp -g

    echo "npm install"
    npm install
    npm rebuild node-sass

    echo "gulp --production"
    gulp --production

    echo "artisan key:generate"
    php artisan key:generate

    cd /var/www/html/application/
    sudo chcon -R -t httpd_sys_rw_content_t storage/
    sudo chcon -R -t httpd_sys_rw_content_t public/
    sudo chcon -R -t httpd_sys_rw_content_t vendor/
    sudo chcon -R -t httpd_sys_rw_content_t /etc/httpd/

    sudo chown -R apache.apache /var/www/html/
    sudo chmod -R 0554 /var/www/html/
    sudo chmod +x -R /var/www/html/
    sudo chmod -R 0775 /var/www/html/application/storage/

    sudo mkdir /var/www/html/application/storage/framework/views
    sudo chown -R apache.apache /var/www/html/application/storage/framework/views

    echo "Changing apache shell to /bin/bash"
    sudo chsh -s /bin/bash apache
    echo "php artisan config:cache"
    sudo su -c "php artisan config:cache" apache
    echo "php artisan cache:clear"
    sudo su -c "php artisan cache:clear" apache

    echo "Resetting apache shell to nologin"
    sudo chsh -s /sbin/nologin apache

    echo "Starting httpd"
    sudo service httpd start

    echo "Cloning server"
    sudo git clone https://github.com/magenta-aps/VoKS-server.git /var/www/html/server
    sudo chown -R apache.apache /var/www/html/server/

    sudo mv ~/server/* /var/www/html/server/configs/

    sudo yum install gcc -y
    sudo yum install gcc-c++ -y

    cd /var/www/html/server/
    echo "npm install"
    sudo npm install --unsafe-perm

    echo "Enabling daemons on startup"
    sudo systemctl enable mysqld
    sudo systemctl enable httpd
    sudo systemctl enable supervisord

    echo "Stopping services"
    sudo service supervisord stop
    sudo service httpd stop
    sudo service mysqld stop

    echo "Starting services"
    sudo service mysqld start
    sudo service httpd start
    sudo service supervisord start

  SHELL
end
