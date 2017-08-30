class PositionSerializer < ActiveModel::Serializer
  attributes :id

  def id
    object.hashid
  end
end
