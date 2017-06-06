class User < ApplicationRecord
  include Pyr::Base::Model::User

  acts_as_simple_cache
  make_authorized_by(:email)

  has_one :employer   # if set you are an employer
  has_one :recruiter  # if set you are a recruiter

  def ui_identifier
    return first_name if first_name
    return username if username
    return email
  end
end
