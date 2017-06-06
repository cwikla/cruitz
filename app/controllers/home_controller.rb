

COMMISSION = 2.5
RECRUITER = 'recruiter'
NORMIE = 'normie'

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
    @type = RECRUITER
  end

  private
  
  def setup
    @type = NORMIE
    @commission = COMMISSION
  end

end
