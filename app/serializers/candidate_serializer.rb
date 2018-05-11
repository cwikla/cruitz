class CandidateSerializer < CandidateSmallSerializer
  attributes :educations,
    :description,
    :works,
    :links,
    :skills,
    :uploads

  has_one :recruiter

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

  def uploads
    object.unlocked? ? object.head.uploads : object.head.uploads.map{ |x| Upload.new(x.id) }
  end
end
