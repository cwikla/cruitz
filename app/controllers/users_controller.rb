class UsersController < ApplicationController
  def me
    render json: {user: current_user}
  end

  private

end
