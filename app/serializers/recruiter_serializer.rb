class RecruiterSerializer < UserSerializer
  attributes :is_recruiter,
    :score

  has_many :reviews

  def json_key
    return 'recruiter'
  end

  def score
    object.score
  end

  def attributes(*args)
    hash = super
    hash[:reviews] = ReviewSerializer.new(object.reviews) if instance_options[:reviews]
    hash
  end

end
