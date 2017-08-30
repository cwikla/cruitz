class CandidateSerializer < ActiveModel::Serializer
  attributes :id,
    :first_name,
    :last_name,
    :phone_number,
    :email,
    :description,
    :job_id,
    :root_message_id

  has_one :recruiter, through: :head, class_name: 'User'

  def id
    object.hashid
  end

  def job_id
    object.job_id ? object.job.hashid : nil
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

  def root_message_id
    m = Message.thread_for_candidate(object).first
    m ? m.hashid : nil
  end

  def description
    m = Message.thread_for_candidate(object).first
    m ? m.body : ""
  end
end
