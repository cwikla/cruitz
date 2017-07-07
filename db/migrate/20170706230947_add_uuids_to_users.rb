class AddUuidsToUsers < ActiveRecord::Migration[5.1]
  def up
    User.find_each do |user|
      user.check_uuid
      user.save
    end
  end

  def down
  end
end
