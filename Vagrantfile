Vagrant.configure("2") do |config|
  config.vm.box = "centos/7"
  config.vm.network "public_network"

  config.vm.provider "virtualbox" do |vb|   
    vb.memory = "2048"
    vb.cpus = 2
  end

  config.ssh.forward_agent = true

  config.vm.provision "file", source: "./provision_files/.", destination: "~/."
  config.vm.provision "shell", privileged: false, inline: <<-SHELL

    echo ""
    sudo rpm -Uvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
    sudo rpm -Uvh https://mirror.webtatic.com/yum/el7/webtatic-release.rpm
    sudo yum update -y

#    sudo firewall-cmd --permanent --add-port=9000/tcp
#    sudo firewall-cmd --permanent --add-port=9001/tcp

    sudo yum install mc nmap htop -y

    sudo yum install wget -y
    sudo wget http://repo.mysql.com/mysql-community-release-el7-5.noarch.rpm
    sudo rpm -ivh mysql-community-release-el7-5.noarch.rpm
    sudo yum update -y
    sudo yum install mysql-server -y
    sudo systemctl start mysqld
    sudo mysql -u root --execute="create database bcs; grant all on bcs.* to 'bcs'@'localhost' identified by 'bcs';"

    sudo yum install php56w php56w-mysql php56w-pdo php56w-pecl-redis php56w-mbstring php56w-libxml php56w-ldap php56w-opcache php56w-pear php56-pecl-imagick php56w-mcrypt php56w-common -y

    curl -sL https://rpm.nodesource.com/setup_6.x | sudo bash -
    sudo yum install nodejs -y

    sudo yum install git -y

    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer

    sudo mv ~/httpd.conf /etc/httpd/conf/httpd.conf

    sudo yum install supervisor -y
    sudo mv ~/supervisord.conf /etc/supervisord.conf
    sudo mv ~/supervisord/* /etc/supervisord/
    #sudo chown?

    sudo service supervisord start

    sudo setsebool httpd_can_sendmail 1
    sudo setsebool httpd_can_network_connect 1

    sudo mv ~/logrotate_httpd /etc/logrotate.d/httpd

    cd /var/www/
    sudo git clone https://github.com/magenta-aps/VoKS-shelter.git /var/www/html/application

    sudo mkdir -p /var/www/html/application/public/uploads/maps
    sudo chmod -R 0755 /var/www/html/application/public/uploads/

    sudo mv ~/.env /var/www/html/application/

    sudo chmod -R 777 /var/www/html/application/
    cd /var/www/html/application/
    composer install
    php artisan migrate

    sudo npm install bower -g
    bower install --allow-root

    sudo npm install gulp -g
    ####sudo npm install -g ????

    sudo chown -R apache.apache /var/www/html/
    sudo chmod -R 0540 /var/www/html/
    sudo chmod -R 0755 /var/www/html/application/storage/


  SHELL
end
