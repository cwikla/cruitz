class SettingsController < ApplicationController
  def index
    return render json: current_user.setting
  end

  def show
    return render json: current_user.setting
  end

  def update
    #puts params.inspect
    if current_user.setting.update(setting_params)
      return render json: true
    else
      return render_create_error json: current_user.setting
    end
  end

  private

  def setting_params
    params.require(:setting).permit(
      :use_ignore_recruiters,
      :minimum_recruiter_score,
      :use_ignore_agencies,
      :minimum_agency_score,
      :use_reject_candidates,
      :reject_candidate_days,
      :use_auto_spam,
      :use_ban_recruiter,
      :ban_recruiter_days,
      :use_recruiter_limit,
      :recruiter_limit,
      :use_agency_limit,
      :agency_limit
    )
  end

end
