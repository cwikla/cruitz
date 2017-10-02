class UsersController < ApplicationController
  def me
    render json: current_user
  end

  def recruiters
    @recruiters = params[:all] ? User.is_recruiter.all : current_user.recruiters # FIXME
    render json: @recruiters, each_serializer: RecruiterSerializer
  end

  def recruiter
    @recruiter = User.is_recruiter.find(params[:id])
    render json: @recruiter, serializer: RecruiterSerializer
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name)
  end


end
