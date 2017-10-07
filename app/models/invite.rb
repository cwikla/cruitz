
DefaultInvite = <<EOM
I'd like to invite you to #{APP_NAME} where I am managing all of my recruiters and incoming
candidates.

It's free for you to sign up, use and send me candidates.  You can manage your outgoing candidates
for free and find other companies and openings to send candidates to.
EOM

class Invite < ApplicationRecord
  cached_belongs_to :user
  cached_belongs_to :from_user, class_name: "User"

  after_initialize :set_defaults, :if => :new_record?

  def set_defaults
    self.body = DefaultInvite
    self.use_default = true
  end
end
