class SessionsController < Pyr::Base::SessionsController

  def after_sign_in_path_for(resource)
    puts "*" * 80
    puts root_url
    root_url
  end

  def create
    self.resource = warden.authenticate!(auth_options)
    set_flash_message!(:notice, :signed_in)
    sign_in(resource_name, resource)
    yield resource if block_given?
    redirect_to after_sign_in_path_for(resource)
  end

end 
