
Pyr.dashboard = {
  pageSetup: function() {
    //$('.pyr-page .page-default').showPage();
  }
};

Pyr.addJob = {
  pageSetup: function() {
    $('#sign-in').bind(Pyr.Form.events.SUCCESS, this.formSuccess);
  },

  formSuccess: function(e, form, data) {
    $('.pyr-page .page-default').showPage();
  },
};
