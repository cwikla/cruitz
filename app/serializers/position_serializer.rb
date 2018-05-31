class PositionSerializer < BaseSerializer
  attributes :id

  def id
    object.hashid
  end
end
