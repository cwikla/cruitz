class Api::BaseController < Pyr::Base::ApplicationController
  protect_from_forgery with: :null_session

  before_action :destroy_session

  rescue_from ActiveRecord::RecordNotFound, with: :not_found


  def not_found
    return api_error(status: 404, errors: 'Not found')
  end

  private

  def destroy_session
    request.session_options[:skip] = true
  end
end
