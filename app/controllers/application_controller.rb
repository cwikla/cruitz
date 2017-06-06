class ApplicationController < Pyr::Base::ApplicationController
  protect_from_forgery with: :exception

  layout :get_layout

  before_action :set_app_name

  private 

  def set_app_name
    @app_name = "CRUITZ"
  end

  def get_layout
    using = "pyr/base/layout"
    if current_user
      using = "application"
    end
    return using
  end
end
