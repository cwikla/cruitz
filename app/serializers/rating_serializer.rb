class RatingSerializer < BaseSerializer
  attributes :id

  def id
    object.hashid
  end
end
