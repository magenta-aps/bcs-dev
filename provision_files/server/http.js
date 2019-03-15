(function(){
    var config = {};
    config.port = 9000;

    config.secure = {};
    config.secure.port = 9001;
    config.secure.enabled = true;
    config.secure.key = '/etc/pki/tls/private/bcomesafe.key';
    config.secure.certificate = '/etc/pki/tls/certs/bcomesafe.crt';

    module.exports = config;
})();
