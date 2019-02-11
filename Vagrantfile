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
  SHELL
end
