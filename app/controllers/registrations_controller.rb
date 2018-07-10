
class RegistrationsController < Pyr::Base::RegistrationsController
  respond_to :json

  def unused_after_sign_up_path_for(resource)
    auth_check_your_email_path
  end

  def unused_after_inactive_sign_up_path_for(resource)
    auth_check_your_email_path
  end

  def unused_after_sign_in_path_for(resource)
    resource.sign_in_count <= 1 ? '/edit_profile' : root_path
  end

  private

end
