class HeadSerializer < ActiveModel::Serializer
  attributes :id,
    :first_name,
    :last_name,
    :phone_number,
    :email,
    :full_name,
    :summary

  has_many :candidates
  has_many :experiences
  has_many :skills
  has_many :links
  has_many :uploads


end
