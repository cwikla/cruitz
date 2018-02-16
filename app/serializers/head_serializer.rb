class HeadSerializer < ActiveModel::Serializer
  attributes :id,
    :first_name,
    :last_name,
    :phone_number,
    :email,
    :full_name

end
