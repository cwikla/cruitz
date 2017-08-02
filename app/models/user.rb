class User < ApplicationRecord
  include Pyr::Base::Model::User

  acts_as_simple_cache
  acts_as_paranoid

  #make_authorized_by(:email)

  before_create :check_jti
  after_create :on_after_create

  has_many :jobs
  has_many :heads
  has_many :messages
  has_many :sent_messages, class_name: "Message", foreign_key: :from_user_id

  belongs_to :company

  def find_message(x)
    find_safe(x).where("user_id = ? or from_user_id = ?", self.id, self.id)
  end

  def self.is_recruiter
     where(is_recruiter: true)
  end

  def ui_identifier
    return first_name if first_name
    return username if username
    return email
  end

  def full_name
    return "#{first_name} #{last_name}"
  end

  def jwt_payload
    {:uuid => self.uuid}
  end

  private

  def on_after_create
    #self.build_employer
  end

  def check_jti
    self.jti ||= SecureRandom.uuid
  end
end
