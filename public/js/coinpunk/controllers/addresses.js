coinpunk.controllers.Addresses = function() {};
coinpunk.controllers.Addresses.prototype = new coinpunk.Controller();

coinpunk.controllers.Addresses.prototype.list = function() {
  var self = this;
  this.render('addresses/list', {addresses: coinpunk.wallet.addresses()}, function(id) {
    self.updateExchangeRates(id, false);
  });
}

coinpunk.controllers.Addresses.prototype.generateNewAddress = function(label) {
  var self = this;
  var label = label || '';
  var address = coinpunk.wallet.createNewAddress(label, false);

  this.saveWallet({address: address, override: true}, function() {
    self.render('addresses/list', {addresses: coinpunk.wallet.addresses()}, function(id) {
      self.updateExchangeRates(id, false);
    });
    $('#newAddressDialog').removeClass('hidden');
    var message = 'Created new address '+address;
    if(label != '')
      var message = message + ' with label '+label;
    $('#newAddressMessage').html(message+'.');
  });
};

coinpunk.controllers.Addresses.prototype.request = function(address) {
  var self = this;
  this.render('addresses/request', {address: address}, function(id) {
    self.drawRequestQR(address);
  });
}

coinpunk.controllers.Addresses.prototype.drawRequestQR = function(address) {
  var uri = URI({protocol: 'bitcoin', path: address});
  
  var amount = $('#amount').val();
  var label = $('#label').val();

  if(amount && amount != '' && amount != '0.00')
    uri.addQuery('amount', amount);

  if(label && label != '')
    uri.addQuery('label', label);

  $('#qrcode').html('');
  new QRCode(document.getElementById('qrcode'), uri.toString());
}

coinpunk.controllers.addresses = new coinpunk.controllers.Addresses();