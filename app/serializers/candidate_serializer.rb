class CandidateSerializer < ActiveModel::Serializer
  attributes :id,
    :uuid,
    :first_name,
    :last_name

  def uuid
    "candidate-#{object.id}"
  end

  def first_name
    object.head.first_name
  end

  def last_name
    object.head.last_name
  end
end
