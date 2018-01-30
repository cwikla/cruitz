class MarketplaceController < ApplicationController
  before_action :check_recruiter
  #before_action :check_registration

  def index
    #redirect_to recruiters_url and return if current_user.is_recruiter
    #redirect_to employers_url
  end

  def info
    @user = current_user
  end

  private 

  def check_recruiter
    if !current_user.is_recruiter?
      redirect_to dashboard_url
      return
    end
  end

  def check_registration
    redirect_to new_user_confirmation_path if  !current_user.confirmed?
  end
end
