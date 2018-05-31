class CandidateSmallSerializer < BaseSerializer
  attributes :id,
    :first_name,
    :last_name,
    :phone_number,
    :email,
    :job_id,
    :state,
    :unlocked_at,
    :summary,
    :score,
    :commission,
    :is_unlocked

  def is_unlocked
    return true if !object.unlocked_at.nil?

    return current_user.id == object.head.user_id
  end

  def is_unlocked?
    is_unlocked
  end

  def first_name
    is_unlocked? ? object.head.first_name : nil
  end

  def last_name
    is_unlocked? ? object.head.last_name : nil
  end

  def phone_number
    is_unlocked? ? object.head.phone_number : nil
  end

  def email
    is_unlocked? ? object.head.email : nil
  end

  def unused_unlocked_at
    object.unlocked_at.in_time_zone.iso8601 if object.unlocked_at
  end

  def summary
    t = object.head.summary
  end

  def score
    88
  end

end
