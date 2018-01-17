class CompanySerializer < ActiveModel::Serializer
  attributes :id,
            :url,
            :name,
            :description,
            :location,
            :logo

  belongs_to :user

  def id
    object.hashid
  end

  def logo
    object.logo ? object.logo.full_name : nil
  end
end
