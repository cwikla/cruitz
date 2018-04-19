class SpamsController < ApplicationController
  def reasons
    render json: Spam::REASONS
  end

  def create
    sp = spams_params

    rec = User.is_recruiter.find(params[:id])

    reason = SpamReason.find(sp[:reason])

    render json: current_user.spams.create!(recruiter: rec, reason: reason)
  end

  def spams_params
    params.require(:spam).permit(:message, :candidate, :reason)
  end

end
