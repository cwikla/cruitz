class ReviewSerializer < ActiveModel::Serializer
  attributes  :from_user,
							:description, 
							:score,
              :created_at,
              :id

  belongs_to :user


  def description
    Pyr::Base::Util::String::emojify(object.description)
  end

  def from_user
    object.from_user
  end

  def created_at
    object.created_at.in_time_zone.iso8601 if object.created_at
  end
end
