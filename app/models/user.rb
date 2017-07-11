class User < ApplicationRecord
  include Pyr::Base::Model::User

  acts_as_simple_cache
  #make_authorized_by(:email)

  before_create :check_jti
  after_create :on_after_create

  has_many :jobs
  has_many :heads

  belongs_to :company


  def ui_identifier
    return first_name if first_name
    return username if username
    return email
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
