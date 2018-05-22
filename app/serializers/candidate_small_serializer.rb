class CandidateSmallSerializer < ActiveModel::Serializer
  attributes :id,
    :first_name,
    :last_name,
    :phone_number,
    :email,
    :job_id,
    :state,
    :unlocked_at,
    :summary

  has_one :recruiter

  def first_name
    object.unlocked? ? object.head.first_name : nil
  end

  def last_name
    object.unlocked? ? object.head.last_name : nil
  end

  def phone_number
    object.unlocked? ? object.head.phone_number : nil
  end

  def email
    object.unlocked? ? object.head.email : nil
  end

  def unlocked_at
    object.unlocked_at.in_time_zone.iso8601 if object.unlocked_at
  end

  def summary
    t = object.head.experiences.select(:title, :place).first
    return "#{t.title} @ #{t.place}" if t
    return nil
  end

end
