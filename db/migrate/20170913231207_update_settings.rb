class UpdateSettings < ActiveRecord::Migration[5.1]
  def up
    Setting.reset_column_information

    User.find_each do |u|
      u.create_setting
    end
  end

  def down
  end
end
