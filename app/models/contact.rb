class Contact < ApplicationRecord

  validates :phone_number, valid_phone_number: true
  validates :email, presence: true, valid_email: true
  validates :name, presence: true
  validates :comment, presence: true

end
