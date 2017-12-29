class RecruiterSerializer < UserSerializer
  attributes :is_recruiter,
    :score

  def json_key
    return 'recruiter'
  end

  def score
    object.score
  end

  def attributes(*args)
    hash = super
    if instance_options[:reviews]
      reviews = ActiveModel::Serializer::CollectionSerializer.new(object.reviews)
      hash[:reviews] = reviews
    end
    hash
  end

end
