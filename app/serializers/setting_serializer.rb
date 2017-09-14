class SettingSerializer < ActiveModel::Serializer
  attributes :use_ignore_recruiters,
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

end
