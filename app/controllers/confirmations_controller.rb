
class ConfirmationsController < Pyr::Base::ConfirmationsController
  respond_to :json

  CHECK_TIME = 60  * 30 # 30 minutes

  def after_confirmation_path_for(resource_name, resource)
    sign_in(resource) if (Time.zone.now - resource.confirmed_at) > CHECK_TIME
    if signed_in?(resource_name)
      signed_in_root_path(resource)
    else
      after_confirmation_path
    end
  end

  private

end
