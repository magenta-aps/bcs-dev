(function(){
    var config = {};
    config.port = 9000;

    config.secure = {};
    config.secure.port = 9001;
    config.secure.enabled = true;
    config.secure.key = '<path to certificate .key file>';
    config.secure.certificate = '<path to certificate .crt file>';

    module.exports = config;
})();
