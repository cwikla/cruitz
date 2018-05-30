class CandidateSerializer < CandidateSmallSerializer
  attributes :educations,
    :description,
    :works,
    :links,
    :skills,
    :uploads,
    :recruiter,
    :candidate_states

  has_many :candidate_states
  #has_one :recruiter

  def candidate_states_unused
    object.candidate_states.order(:id)
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
    object.unlocked? ? object.head.links : object.head.links.map{ |x| Link.new(ltype: x.ltype, id: x.id) }
  end

  def recruiter
    RecruiterSerializer.new(object.recruiter)
  end

  def uploads
    return ActiveModel::Serializer::CollectionSerializer.new(object.head.uploads) if object.unlocked? 

    ups = object.head.uploads.map{ |x| 
      { id: nil, content_type: x.content_type }
     }

    return ups

  end

  def score
    88
  end
end
