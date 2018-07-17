class RecruiterSerializer < UserSerializer
  attributes :is_recruiter,
    :score


  def json_key
    return 'recruiter'
  end

  def score
    (rand * 3) + 2 # FIXME
  end

  def attributes(*args)
    hash = super
    if instance_options[:reviews]
      reviews = object.reviews.order("-id")
      reviews = ActiveModel::Serializer::CollectionSerializer.new(reviews)
      hash[:reviews] = reviews
    end
    hash
  end

end
