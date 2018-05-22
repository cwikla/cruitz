class CandidateStateSerializer < ActiveModel::Serializer
  attributes :id, 
    :state, 
    :created_at

  def created_at
    object.created_at.in_time_zone.iso8601 if object.created_at
  end

end

