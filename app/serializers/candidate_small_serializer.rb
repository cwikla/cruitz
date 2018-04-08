class CandidateSmallSerializer < ActiveModel::Serializer
  attributes :id,
    :first_name,
    :last_name,
    :phone_number,
    :email,
    :job_id,
    :state

  def first_name
    object.head.first_name
  end

  def last_name
    object.head.last_name
  end

  def phone_number
    object.head.phone_number
  end

  def email
    object.head.email
  end
end
