class CandidateSerializer < CandidateSmallSerializer
  attributes :skills,
    :educations,
    :description,
    :works

  has_one :recruiter

  def root_message_id
    return nil # FIXME

    m = Message.threads_for_candidate(object).first
    m ? m.hashid : nil
  end

  def description
    m = Message.threads_for_candidate(object).first
    m ? m.body : ""
  end

  def educations
    object.head.educations
  end

  def works
    object.head.works
  end

  def skills
    []
  end
end
