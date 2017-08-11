class UsersController < ApplicationController
  def me
    render json: current_user
  end

  def recruiters
    render json: User.recruiter.all
  end

  private

end
