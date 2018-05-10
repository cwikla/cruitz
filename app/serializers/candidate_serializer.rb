class CandidateSerializer < CandidateSmallSerializer
  attributes :educations,
    :description,
    :works,
    :links,
    :skills,
    :uploads

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
    object.head.skills
  end

  def links
    object.head.links
  end

  def uploads
    object.head.uploads
  end
end
