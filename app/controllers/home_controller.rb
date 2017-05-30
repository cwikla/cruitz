class HomeController < ApplicationController

#  skip_before_filter :authenticate_user_by_auth_token!
  skip_before_action :authenticate_user!

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

end
