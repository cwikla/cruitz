
Pyr.dashboard = {
  pageSetup: function() {
    $('.page-default').showPage();
  };
};

Pyr.addJob = {
  pageSetup: function() {
    $('#sign-in').bind(Pyr.Form.events.SUCCESS, this.formSuccess);
  },

  formSuccess: function(e, form, data) {
    $('.page-default').showPage();
  },
};
