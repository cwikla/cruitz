class DashboardController < ApplicationController
  def index
    redirect_to recruiters_url and return if current_user.recruiter
    redirect_to employers_url
  end
end
