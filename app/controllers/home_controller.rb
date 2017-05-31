

COMMISSION = 2.5

class HomeController < ApplicationController

#  skip_before_filter :authenticate_user_by_auth_token!
  skip_before_action :authenticate_user!

  before_action :setup

  def index
  end

  def privacy_policy
  end

  def pricing
  end

  def about
  end

  def recruiters
  end

  private
  
  def setup
    @commission = COMMISSION
  end

end
