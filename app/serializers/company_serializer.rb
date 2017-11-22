class CompanySerializer < ActiveModel::Serializer
  attributes :id,
            :name,
            :description,
            :url,
            :location

  belongs_to :user

  def id
    object.hashid
  end
end
