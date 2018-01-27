class JobSerializer < ActiveModel::Serializer
  attributes  :id,
              :title, 
							:description, 
							:time_commit, 
              :candidate_counts,
              :user_id,
              :created_at,
              :category

  #has_many :candidates, serializer: CandidateSerializer, if: :should_cand?
  has_many :locations
  has_many :skills

  def id
    object.hashid
  end

  def category
    cat = object.categories.first
    return nil if cat.nil?

    return CategorySerializer.new(cat)
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
    if instance_options[:candidates]
      hash[:candidates] = ActiveModel::Serializer::CollectionSerializer.new(object.candidates) 
    end
    hash
  end

end
