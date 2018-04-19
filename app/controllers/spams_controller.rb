class SpamsController < ApplicationController
  def reasons
    render json: Spam::REASONS
  end

  def create
    sp = spams_params

    val = Spam.make(current_user, params[:id], sp[:reason])
    render json: val
  end

  def spams_params
    params.require(:spam).permit(:message, :candidate, :reason)
  end

end
