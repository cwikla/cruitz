class JobSerializer < ActiveModel::Serializer
  attributes  :id,
              :uuid,
              :title, 
							:description, 
							:time_commit, 
							:location,
              :candidate_count,
              :user_id

  has_many :candidates, serializer: CandidateSerializer, if: :should_cand?

  def title
    Pyr::Base::Util::String::emojify(object.title)
  end

  def description
    Pyr::Base::Util::String::emojify(object.description)
  end

  def candidate_count
    object.candidates.isnew.count
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
