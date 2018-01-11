class UsersController < ApplicationController
  def me
    render json: current_user
  end

  def recruiters
    @recruiters = params[:all] || true ? User.is_recruiter.all : current_user.recruiters # FIXME
    render json: @recruiters, each_serializer: RecruiterSerializer
  end

  def recruiter
    @recruiter = User.is_recruiter.find(params[:id])
    render json: @recruiter, serializer: RecruiterSerializer, reviews: true
  end

  def password
    pwd = params.require(:user).require(:password)
    current_user.password = pwd
    return current_user.save

  end
  private

  def user_params
    params.require(:user).permit(:first_name, :last_name)
  end

  


end
