class JobSerializer < ActiveModel::Serializer
  attributes  :id,
              :title, 
							:description, 
							:time_commit, 
							:location,
              :candidate_counts,
              :user_id,
              :created_at

  has_many :candidates, serializer: CandidateSerializer, if: :should_cand?

  def id
    object.hashid
  end

  def user_id
    object.user.hashid
  end

  def title
    Pyr::Base::Util::String::emojify(object.title)
  end

  def description
    Pyr::Base::Util::String::emojify(object.description)
  end

  def candidate_counts
   {
      total: object.candidates.count,
      accepted: object.candidates.accepted.count,
      rejected: object.candidates.rejected.count,
      waiting: object.candidates.isnew.count
    }
  end

  def should_cand?
    return instance_options[:cand]
  end

  def attributes(*args)
    hash = super
    hash[:candidates] = CandidateSerializer.new(object.candidates.live) if instance_options[:cand]
    hash
  end

end
