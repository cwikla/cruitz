class CandidateSerializer < ActiveModel::Serializer
  attributes :id,
    :uuid,
    :first_name,
    :last_name,
    :phone_number,
    :email,
    :description,
    :job_id

  def uuid
    "candidate-#{object.id}"
  end

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

  def description
    m = Message.thread_for_candidate(object).first
    m ? m.body : ""
  end
end
