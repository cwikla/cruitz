class ApplicationController < Pyr::Base::ApplicationController
  #include ActionController::Serialization
  protect_from_forgery with: :exception

  layout :get_layout

  before_action :set_app_name

  private 

  def set_app_name
    @app_name = "CRUITZ"
    if params[:debug]
      if params[:debug].to_i == 1
        session[:debug] = true
      elsif params[:debug].to_i == 0
        session[:debug] = false
      end
    end
  end

  def get_layout
    using = "pyr/base/layout"
    return using
  end
end
