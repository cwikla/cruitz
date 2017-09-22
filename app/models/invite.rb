
DefaultInvite = <<EOM
I'd like to invite you to #{APP_NAME} where I am managing all of my recruiters and incoming
candidates.

It's free for you to sign up, use and send me candidates.  You can manage your outgoing candidates
for free and find other openings to send candidates too.
EOM

class Invite < ApplicationRecord
  belongs_to :invited_user, class_name: "User"
  belongs_to :user

  after_initialize :set_defaults, :if => :new_record?

  def set_defaults
    self.body = DefaultInvite
    self.use_default = true
  end
end
