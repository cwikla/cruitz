

class ExperienceSerializer < ActiveModel::Serializer
  attributes :place,
    :title,
    :exp_type,
    :year_start,
    :year_end,
    :description,
    :id

  def id
    object.hashid
  end
end
