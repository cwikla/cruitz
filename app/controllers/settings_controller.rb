class SettingsController < ApplicationController
  def index
    return render json: current_user.setting
  end
end
