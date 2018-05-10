class ChangeIsRecruiterCuzImDumb < ActiveRecord::Migration[5.1]
  def up
    rename_column :users, :is_recruiter, :old_is_recruiter
    add_column :users, :is_recruiter, :boolean, default: false

    User.reset_column_information

    User.find_each(batch_size: 100) do |u|
      u.is_recruiter = !(u.old_is_recruiter == 0)
      u.save
    end

    remove_column :users, :old_is_recruiter
  end

  def down
    rename_column :users, :is_recruiter, :old_is_recruiter
    add_column :users, :is_recruiter, :integer, default: 0

    User.reset_column_information

    User.find_each(batch_size: 100) do |u|
      u.is_recruiter = u.old_is_recruiter ? 1 : 0
      u.save
    end

    remove_column :users, :old_is_recruiter
  end
end
