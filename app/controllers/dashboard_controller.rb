class DashboardController < ApplicationController
  #before_action :check_registration

  def index
    #redirect_to recruiters_url and return if current_user.recruiter
    #redirect_to employers_url
  end

  private 

  def check_registration
    redirect_to new_user_confirmation_path if  !current_user.confirmed?
  end
end
